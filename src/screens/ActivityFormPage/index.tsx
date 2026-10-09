import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookOpen from 'lucide-react-native/icons/book-open';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import FileText from 'lucide-react-native/icons/file-text';
import Library from 'lucide-react-native/icons/library';
import type { LucideIcon } from 'lucide-react-native';

import { ChoiceChip } from '@/components/ui/ChoiceChip';
import { DateField } from '@/components/ui/DateField';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormField } from '@/components/ui/FormField';
import { FormFooter } from '@/components/ui/FormFooter';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SubjectChip } from '@/components/ui/SubjectChip';
import { SwitchField } from '@/components/ui/SwitchField';
import { FORM_FOOTER_HEIGHT, Palette, Radius, SCREEN_PADDING } from '@/constants/theme';
import { formatDDMMYYYY } from '@/domain/date';
import type { ActivityType } from '@/domain/models';
import { validateActivity, type FieldErrors } from '@/domain/validation';
import { useActivities } from '@/hooks/use-activities';
import BookX from 'lucide-react-native/icons/book-x';

const TYPE_OPTIONS: { value: ActivityType; label: string; Icon: LucideIcon }[] = [
  { value: 'tarefa', label: 'Tarefa', Icon: ClipboardList },
  { value: 'trabalho', label: 'Trabalho', Icon: FileText },
  { value: 'leitura', label: 'Leitura', Icon: BookOpen },
  { value: 'estudo', label: 'Estudo', Icon: Library },
];

// `null` = campo ainda não editado; nesse caso o valor exibido é o da atividade carregada
// (getAll do hook + find), que chega assincronamente. Evita effect de prefill.
type Draft = string | null;

export default function ActivityFormPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { activities, subjects, loading, create, update, remove } = useActivities();

  const isEdit = id !== undefined;
  const original = isEdit ? activities.find((activity) => activity.id === id) : undefined;

  const [titleDraft, setTitleDraft] = useState<Draft>(null);
  const [subjectDraft, setSubjectDraft] = useState<Draft>(null);
  const [typeDraft, setTypeDraft] = useState<ActivityType | null>(null);
  const [dueDraft, setDueDraft] = useState<Draft>(null);
  // `null` = ainda não tocado; aí vale o `reminder` da atividade carregada (Slice 8).
  const [reminderDraft, setReminderDraft] = useState<boolean | null>(null);
  const [descriptionDraft, setDescriptionDraft] = useState<Draft>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const title = titleDraft ?? original?.title ?? '';
  const subjectId = subjectDraft ?? original?.subjectId ?? '';
  const type = typeDraft ?? original?.type ?? 'tarefa';
  // Draft em ISO; '' = usuário limpou o campo (não cair no valor original).
  const dueDateISOValue = dueDraft ?? original?.dueDate ?? null;
  const dueDateISO = dueDateISOValue === '' ? null : dueDateISOValue;
  const dueDate = dueDateISO === null ? '' : formatDDMMYYYY(dueDateISO);
  const description = descriptionDraft ?? original?.description ?? '';
  const reminder = reminderDraft ?? original?.reminder ?? false;

  // CA-04.4: sem matéria não se salva — o form vira ponte para o cadastro de matérias.
  const noSubjects = !loading && subjects.length === 0;

  // O aviso de prazo passado é não-bloqueante e aparece enquanto se escolhe (CA-04.3);
  // a mensagem vem do domínio, não é reescrita aqui.
  const liveWarning = useMemo(
    () => validateActivity({ title, subjectId, dueDate }, subjects.length > 0).dueDateWarning,
    [title, subjectId, dueDate, subjects.length],
  );

  function clearFieldError(field: string) {
    setErrors((previous) => {
      if (previous[field] === undefined) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  async function onSubmit() {
    setSubmitTried(true);
    setBlockMessage(null);
    const input = { title, subjectId, dueDate, type, description, reminder };
    const result = isEdit ? await update(id, input) : await create(input);
    if (result.ok) {
      router.back();
      return;
    }
    setErrors(result.errors);
  }

  function onConfirmDelete() {
    if (!isEdit) return;
    Alert.alert('Excluir atividade', 'Tem certeza? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await remove(id);
              router.back();
            } catch {
              setBlockMessage('Não foi possível excluir.');
            }
          })();
        },
      },
    ]);
  }

  const titleError = submitTried ? errors.title : undefined;
  const subjectError = submitTried ? errors.subjectId : undefined;
  const dueError = submitTried ? errors.dueDate : undefined;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={isEdit ? 'Editar atividade' : 'Nova atividade'}
        backLabel="Fechar"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        // O rodapé é `position: absolute`: o conteúdo precisa reservar a altura dele.
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FORM_FOOTER_HEIGHT }]}
        keyboardShouldPersistTaps="handled">
        {noSubjects ? (
          <View style={styles.block}>
            <EmptyState
              icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
              title="Cadastre uma matéria"
              text="Atividades sempre pertencem a uma matéria."
              actionLabel="Cadastrar matéria"
              actionWithIcon={false}
              onAction={() => router.push('/subject-form')}
            />
          </View>
        ) : null}

        <View pointerEvents={noSubjects ? 'none' : 'auto'} style={noSubjects ? { opacity: 0.4 } : undefined}>
          <Input
            label="Título"
            value={title}
            onChangeText={(text) => {
              setTitleDraft(text);
              clearFieldError('title');
            }}
            placeholder="ex: Lista 3 — exercícios 1 a 10"
            error={titleError}
            maxLength={120}
          />

          <FormField label="Matéria" error={subjectError}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingRight: 8 }}>
              {subjects.map((subject) => (
                <SubjectChip
                  key={subject.id}
                  subject={subject}
                  selected={subject.id === subjectId}
                  onPress={() => {
                    setSubjectDraft(subject.id);
                    clearFieldError('subjectId');
                  }}
                />
              ))}
            </ScrollView>
          </FormField>

          <FormField label="Tipo">
            <View style={styles.types}>
              {TYPE_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.value}
                  selected={option.value === type}
                  onPress={() => setTypeDraft(option.value)}
                  icon={
                    <option.Icon
                      size={18}
                      color={option.value === type ? Palette.accent : Palette.textTertiary}
                      strokeWidth={1.8}
                    />
                  }
                  label={option.label}
                />
              ))}
            </View>
          </FormField>

          <DateField
            label="Prazo (opcional)"
            value={dueDateISO}
            onChange={(iso) => {
              setDueDraft(iso === null ? '' : iso);
              clearFieldError('dueDate');
            }}
            error={dueError}
            warning={liveWarning}
            disabled={noSubjects}
          />

          {/* Lembrete só faz sentido com prazo — sem data o switch desliga (spec Slice 8). */}
          <View style={styles.reminderGroup}>
            <SwitchField
              label="Lembrar"
              description="Avisa um dia antes do prazo"
              value={reminder && dueDateISO !== null}
              onChange={setReminderDraft}
              disabled={noSubjects || dueDateISO === null}
            />
          </View>

          <Input
            label="Descrição (opcional)"
            value={description}
            onChangeText={(text) => {
              setDescriptionDraft(text);
              clearFieldError('description');
            }}
            placeholder="Links, material de apoio, detalhes…"
            multiline
            maxLength={400}
          />
        </View>
      </ScrollView>

      <FormFooter
        onSave={() => void onSubmit()}
        saveDisabled={noSubjects}
        onDelete={isEdit ? onConfirmDelete : undefined}
        onCancel={() => router.back()}
        message={blockMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 8,
  },
  block: {
    height: 300,
    marginBottom: 20,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderGroup: {
    marginBottom: 20,
  },
});