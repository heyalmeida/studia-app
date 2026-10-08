import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import BookX from 'lucide-react-native/icons/book-x';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';

import { DateField } from '@/components/ui/DateField';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormField } from '@/components/ui/FormField';
import { FormFooter } from '@/components/ui/FormFooter';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SubjectChip } from '@/components/ui/SubjectChip';
import { Palette } from '@/constants/theme';
import { formatDDMMYYYY } from '@/domain/date';
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
  // Draft em ISO; '' = usuário limpou o campo (não cair no valor original).
  const dateISOValue = dateDraft ?? original?.date ?? null;
  const dateISO = dateISOValue === '' ? null : dateISOValue;
  const date = dateISO === null ? '' : formatDDMMYYYY(dateISO);

  // CA-08.1: sem matéria não se salva — o form vira ponte para o cadastro de matérias.
  const noSubjects = !loading && subjects.length === 0;

  // O aviso de data passada é não-bloqueante (CA-08.2); a mensagem vem do domínio.
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
      <ScreenHeader
        title={isEdit ? 'Editar avaliação' : 'Nova avaliação'}
        leading={{
          icon: <ChevronLeft size={20} color={Palette.textSecondary} />,
          label: 'Fechar',
          onPress: () => router.back(),
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 20 }}
        keyboardShouldPersistTaps="handled">
        {noSubjects ? (
          <View className="overflow-hidden rounded-card border border-border" style={{ height: 220 }}>
            <EmptyState
              icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
              title="Cadastre uma matéria"
              text="Avaliações sempre pertencem a uma matéria."
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
            placeholder="ex: Prova 1"
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

          <DateField
            label="Data"
            value={dateISO}
            onChange={(iso) => {
              setDateDraft(iso === null ? '' : iso);
              clearFieldError('date');
            }}
            error={dateError}
            warning={liveWarning}
            disabled={noSubjects}
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