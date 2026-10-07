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
import { validateAssessment, type FieldErrors } from '@/domain/validation';
import { useAssessments } from '@/hooks/use-assessments';

// `null` = campo ainda não editado; nesse caso o valor exibido é o da avaliação carregada
// (getAll do hook + find), que chega assincronamente. Evita effect de prefill.
type Draft = string | null;

export default function AssessmentFormPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { assessments, subjects, loading, create, update, remove } = useAssessments();

  const isEdit = id !== undefined;
  const original = isEdit ? assessments.find((assessment) => assessment.id === id) : undefined;

  const [titleDraft, setTitleDraft] = useState<Draft>(null);
  const [subjectDraft, setSubjectDraft] = useState<Draft>(null);
  const [dateDraft, setDateDraft] = useState<Draft>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const title = titleDraft ?? original?.title ?? '';
  const subjectId = subjectDraft ?? original?.subjectId ?? '';
  const date = dateDraft ?? (original === undefined ? '' : formatDDMMYYYY(original.date));

  // CA-08.1: sem matéria não se salva — o form vira ponte para o cadastro de matérias.
  const noSubjects = !loading && subjects.length === 0;

  // O aviso de data passada é não-bloqueante e aparece enquanto se digita (CA-08.2);
  // a mensagem vem do domínio, não é reescrita aqui.
  const liveWarning = useMemo(
    () => validateAssessment({ title, subjectId, date }, subjects.length > 0).dateWarning,
    [title, subjectId, date, subjects.length],
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
    const input = { title, subjectId, date };
    const result = isEdit ? await update(id, input) : await create(input);
    if (result.ok) {
      router.back();
      return;
    }
    setErrors(result.errors);
  }

  function onConfirmDelete() {
    if (!isEdit) return;
    Alert.alert('Excluir avaliação', 'Tem certeza? Essa ação não pode ser desfeita.', [
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
  const dateError = submitTried ? errors.date : undefined;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={isEdit ? 'Editar avaliação' : 'Nova avaliação'} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 64, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        {noSubjects ? (
          <View className="overflow-hidden rounded-card border border-border" style={{ height: 200 }}>
            <EmptyState
              title="Cadastrar matéria"
              text="Cadastre uma matéria antes de criar avaliações."
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

          <Input
            label="Data"
            value={date}
            onChangeText={(text) => {
              setDateDraft(maskDDMMYYYY(text));
              clearFieldError('date');
            }}
            keyboardType="number-pad"
            maxLength={10}
            error={dateError}
            warning={liveWarning}
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