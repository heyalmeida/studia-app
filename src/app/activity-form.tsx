import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Monogram } from '@/components/ui/Monogram';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { formatDDMMYYYY } from '@/domain/date';
import type { ActivityType } from '@/domain/models';
import { validateActivity, type FieldErrors } from '@/domain/validation';
import { useActivities } from '@/hooks/use-activities';
import { useTheme } from '@/hooks/use-theme';

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: 'tarefa', label: 'Tarefa' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'leitura', label: 'Leitura' },
  { value: 'estudo', label: 'Estudo' },
];

/** Máscara DD/MM/AAAA: só dígitos, com '/' inserida a cada 2 dígitos ('0710' -> '07/10'). */
function maskDueDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// `null` = campo ainda não editado; nesse caso o valor exibido é o da atividade carregada
// (getAll do hook + find), que chega assincronamente. Evita effect de prefill.
type Draft = string | null;

function ChoiceChip({
  selected,
  onPress,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const colors = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.background : colors.backgroundElement,
          borderColor: selected ? colors.borderStrong : 'transparent',
          borderWidth: selected ? 1.5 : 1,
        },
      ]}>
      <View style={styles.chipContent}>{children}</View>
    </Pressable>
  );
}

export default function ActivityFormScreen() {
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { activities, subjects, loading, create, update, remove } = useActivities();

  const isEdit = id !== undefined;
  const original = isEdit ? activities.find((activity) => activity.id === id) : undefined;

  const [titleDraft, setTitleDraft] = useState<Draft>(null);
  const [subjectDraft, setSubjectDraft] = useState<Draft>(null);
  const [typeDraft, setTypeDraft] = useState<ActivityType | null>(null);
  const [dueDraft, setDueDraft] = useState<Draft>(null);
  const [descriptionDraft, setDescriptionDraft] = useState<Draft>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const title = titleDraft ?? original?.title ?? '';
  const subjectId = subjectDraft ?? original?.subjectId ?? '';
  const type = typeDraft ?? original?.type ?? 'tarefa';
  const dueDate = dueDraft ?? (original?.dueDate === null || original?.dueDate === undefined
    ? ''
    : formatDDMMYYYY(original.dueDate));
  const description = descriptionDraft ?? original?.description ?? '';

  // CA-04.4: sem matéria não se salva — o form vira ponte para o cadastro de matérias.
  const noSubjects = !loading && subjects.length === 0;

  // O aviso de prazo passado é não-bloqueante e aparece enquanto se digita (CA-04.3);
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
    const input = { title, subjectId, dueDate, type, description };
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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={isEdit ? 'Editar atividade' : 'Nova atividade'} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {noSubjects ? (
          <View style={[styles.bridge, { borderColor: colors.border }]}>
            <EmptyState
              title="Nenhuma matéria cadastrada"
              text="Cadastre uma matéria antes de criar atividades."
              actionLabel="Cadastrar matéria"
              onAction={() => router.push('/subject-form')}
            />
          </View>
        ) : null}

        <View pointerEvents={noSubjects ? 'none' : 'auto'} style={noSubjects ? styles.disabled : null}>
          <Input
            label="Título"
            value={title}
            onChangeText={(text) => {
              setTitleDraft(text);
              clearFieldError('title');
            }}
            error={titleError}
            maxLength={120}
          />

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Matéria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.chipRow}>
              {subjects.map((subject) => (
                <ChoiceChip
                  key={subject.id}
                  selected={subject.id === subjectId}
                  onPress={() => {
                    setSubjectDraft(subject.id);
                    clearFieldError('subjectId');
                  }}>
                  <Monogram name={subject.name} size="sm" />
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: subject.id === subjectId ? colors.text : colors.textSecondary },
                    ]}
                    numberOfLines={1}>
                    {subject.name}
                  </Text>
                </ChoiceChip>
              ))}
            </ScrollView>
            {subjectError !== undefined ? (
              <Text style={[styles.message, { color: colors.text }]}>{subjectError}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo</Text>
            <View style={styles.typeRow}>
              {TYPE_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.value}
                  selected={option.value === type}
                  onPress={() => setTypeDraft(option.value)}>
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: option.value === type ? colors.text : colors.textSecondary },
                    ]}>
                    {option.label}
                  </Text>
                </ChoiceChip>
              ))}
            </View>
          </View>

          <Input
            label="Prazo (opcional)"
            value={dueDate}
            onChangeText={(text) => {
              setDueDraft(maskDueDate(text));
              clearFieldError('dueDate');
            }}
            keyboardType="number-pad"
            maxLength={10}
            error={dueError}
            warning={liveWarning}
          />

          <Input
            label="Descrição (opcional)"
            value={description}
            onChangeText={(text) => {
              setDescriptionDraft(text);
              clearFieldError('description');
            }}
            multiline
            maxLength={400}
          />
        </View>

        <View style={styles.actions}>
          <View style={styles.fullWidth}>
            <Button
              label="Salvar"
              variant="primary"
              disabled={noSubjects}
              onPress={() => void onSubmit()}
            />
          </View>

          {isEdit ? (
            <View style={styles.fullWidth}>
              <Button label="Excluir" variant="ghost" onPress={onConfirmDelete} />
              {blockMessage !== null ? (
                <Text style={[styles.block, { color: colors.textSecondary }]}>{blockMessage}</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.fullWidth}>
            <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  disabled: {
    opacity: 0.4,
  },
  bridge: {
    height: 200,
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    ...Typography.section,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    flexShrink: 0,
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  chipLabel: {
    ...Typography.meta,
    flexShrink: 1,
  },
  message: {
    ...Typography.meta,
  },
  actions: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  fullWidth: {
    width: '100%',
  },
  block: {
    ...Typography.meta,
    textAlign: 'center',
    paddingTop: Spacing.one,
  },
});