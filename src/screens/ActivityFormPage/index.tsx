import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ChoiceChip } from '@/components/ui/ChoiceChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Monogram } from '@/components/ui/Monogram';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { formatDDMMYYYY, maskDDMMYYYY } from '@/domain/date';
import type { ActivityType } from '@/domain/models';
import { validateActivity, type FieldErrors } from '@/domain/validation';
import { useActivities } from '@/hooks/use-activities';

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: 'tarefa', label: 'Tarefa' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'leitura', label: 'Leitura' },
  { value: 'estudo', label: 'Estudo' },
];

// `null` = campo ainda não editado; nesse caso o valor exibido é o da atividade carregada
// (getAll do hook + find), que chega assincronamente. Evita effect de prefill.
type Draft = string | null;

export default function ActivityFormPage() {
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
    <View className="flex-1 bg-background">
      <ScreenHeader title={isEdit ? 'Editar atividade' : 'Nova atividade'} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 64, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        {noSubjects ? (
          <View className="overflow-hidden rounded-card border border-border" style={{ height: 200 }}>
            <EmptyState
              title="Nenhuma matéria cadastrada"
              text="Cadastre uma matéria antes de criar atividades."
              actionLabel="Cadastrar matéria"
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
            error={titleError}
            maxLength={120}
          />

          <View className="gap-one">
            <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
              Matéria
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingRight: 16 }}>
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
                    className={
                      subject.id === subjectId
                        ? 'flex-shrink text-meta text-text'
                        : 'flex-shrink text-meta text-text-secondary'
                    }
                    numberOfLines={1}>
                    {subject.name}
                  </Text>
                </ChoiceChip>
              ))}
            </ScrollView>
            {subjectError !== undefined ? (
              <Text className="text-meta text-text">{subjectError}</Text>
            ) : null}
          </View>

          <View className="gap-one">
            <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
              Tipo
            </Text>
            <View className="flex-row gap-two">
              {TYPE_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.value}
                  grow
                  selected={option.value === type}
                  onPress={() => setTypeDraft(option.value)}>
                  <Text
                    className={
                      option.value === type
                        ? 'flex-shrink text-meta text-text'
                        : 'flex-shrink text-meta text-text-secondary'
                    }>
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
              setDueDraft(maskDDMMYYYY(text));
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

        <View className="mt-two gap-two">
          <View className="w-full">
            <Button
              label="Salvar"
              variant="primary"
              disabled={noSubjects}
              onPress={() => void onSubmit()}
            />
          </View>

          {isEdit ? (
            <View className="w-full">
              <Button label="Excluir" variant="ghost" onPress={onConfirmDelete} />
              {blockMessage !== null ? (
                <Text className="pt-one text-center text-meta text-text-secondary">
                  {blockMessage}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View className="w-full">
            <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
