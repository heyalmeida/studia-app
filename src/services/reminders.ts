import { Platform } from 'react-native';
// Imports profundos (e não o barrel `expo-notifications`): ver "POR QUE IMPORTS PROFUNDOS"
// abaixo. O SDK 57 lança no import do barrel no Android/Expo Go, e o barrel é a única
// cadeia de código que puxa `TokenEmitter`/`topicSubscription`.
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

import { parseISODateParts } from '@/domain/date';

/**
 * Serviço de lembretes locais (Slice 8) — **único** módulo do app que fala com
 * `expo-notifications`, por decisão de arquitetura: o SDK nativo fica isolado atrás de três
 * funções e nenhum hook/screen o toca (mesma disciplina de `storage.ts` com o AsyncStorage).
 * Push remoto NÃO é usado — foi removido do Expo Go no SDK 53+; notificação **local**
 * continua disponível no Expo Go.
 *
 * ## Formato do trigger (doc do SDK 57)
 * https://docs.expo.dev/versions/v57.0.0/sdk/notifications/ → tipo `DateTriggerInput`:
 * `{ type: SchedulableTriggerInputTypes.DATE, date: Date, channelId? }` — disparo único no
 * instante informado. **Não existe** `torchScheduled`; `dateComponents` pertence ao trigger
 * `CALENDAR` (iOS, repetitivo) e `seconds` ao `TIME_INTERVAL` — nenhum dos dois serve para
 * "08:00 do dia anterior". Um `Date` local resolve o fuso do aparelho, que é o comportamento
 * desejado ("o usuário espera o aviso no próprio horário").
 *
 * ## POR QUE IMPORTS PROFUNDOS
 * A doc afirma que notificações locais continuam disponíveis no Expo Go — e isso é verdade no
 * iOS. No **Android com Expo Go**, porém, o SDK 57 quebra no simples `import * as Notifications
 * from 'expo-notifications'`: `index.js` reexporta `TokenEmitter`, e esse módulo chama
 * `warnOfExpoGoPushUsage()` no escopo do módulo, que lança para Android/Expo Go
 * (`warnOfExpoGoPushUsage.js`). O app inteiro quebra antes de qualquer chamada nossa.
 * Importando direto os módulos que usamos — nenhum deles puxa essa cadeia — o lembrete local
 * funciona também no Android/Expo Go. O tipo do input do agendamento continua vindo do barrel,
 * então a checagem de tipo do trigger permanece oficial.
 */

/** Canal Android dos lembretes. No Android 13+ o prompt de permissão só aparece após existir um canal. */
const CHANNEL_ID = 'studia-reminders';

/** Antecedência de dias: o Studia avisa 1 dia antes (spec Slice 8). */
const REMINDER_DAYS_BEFORE = 1;

/** Hora fixa do disparo, no fuso local do aparelho (spec Slice 8). */
const REMINDER_HOUR = 8;
const REMINDER_MINUTE = 0;

const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';

// Comportamento em primeiro plano (banner + som + badge), conforme o exemplo da doc.
// Registrar no module scope evita perder a notificação que chega com o app aberto.
// Em web o módulo nativo é inerte: não registramos handler para não tocar a API.
if (!isWeb) {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/** Guarda de execução única: o canal é criado no máximo uma vez por sessão do app. */
let channelPromise: Promise<void> | null = null;

function ensureAndroidChannel(): Promise<void> {
  if (channelPromise !== null) return channelPromise;
  channelPromise = setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Lembretes',
    importance: AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  })
    .then(() => undefined)
    .catch((error: unknown) => {
      console.warn('[reminders] não foi possível criar o canal de notificações:', error);
    });
  return channelPromise;
}

/**
 * Garante a permissão de notificação. `true` = o app pode exibir notificação.
 * `false` em web e quando o usuário nega — o chamador salva o registro sem agendar
 * (CA-8.1: switch ligado, `notificationId` null).
 */
export async function ensurePermission(): Promise<boolean> {
  if (isWeb) return false;

  try {
    if (isAndroid) await ensureAndroidChannel();

    const current = await getPermissionsAsync();
    if (current.granted) return true;

    const requested = await requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return requested.granted;
  } catch (error) {
    console.warn('[reminders] falha ao verificar permissões:', error);
    return false;
  }
}

/**
 * Agenda o lembrete de 1 dia antes do prazo, às 08:00 (fuso local), e devolve o id da
 * notificação — ou `null` quando nada foi agendado: web, permissão negada, prazo já
 * passado / dia anterior já encerrado, `dueISO` inválido ou erro do sistema.
 */
export async function scheduleForDueDate(title: string, dueISO: string): Promise<string | null> {
  if (isWeb) return null;

  const parts = parseISODateParts(dueISO);
  if (parts === null) return null;

  // 08:00 do dia ANTERIOR ao prazo, em hora local (new Date(y, m-1, d-1, 8, 0)).
  const target = new Date(
    parts.year,
    parts.month - 1,
    parts.day - REMINDER_DAYS_BEFORE,
    REMINDER_HOUR,
    REMINDER_MINUTE,
    0,
  );
  if (target.getTime() <= Date.now()) return null;

  try {
    if (!(await ensurePermission())) return null;

    return await scheduleNotificationAsync({
      content: {
        title: 'Lembrete',
        body: `Amanhã: ${title}`,
        sound: 'default',
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: target,
        // No Android o canal decide importance/vibração; o iOS ignora a propriedade.
        ...(isAndroid ? { channelId: CHANNEL_ID } : null),
      },
    });
  } catch (error) {
    console.warn('[reminders] falha ao agendar o lembrete:', error);
    return null;
  }
}

/**
 * Cancela um lembrete agendado. `null` = nada agendado (no-op). Falha é engolida de propósito:
 * remover uma notificação morta nunca pode impedir concluir/excluir o registro (RNF-04).
 */
export async function cancel(id: string | null): Promise<void> {
  if (id === null || isWeb) return;
  try {
    await cancelScheduledNotificationAsync(id);
  } catch {
    // Notificação já disparada ou id inválido: nada a fazer.
  }
}
