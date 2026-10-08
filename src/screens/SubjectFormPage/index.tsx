import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconPicker } from '@/components/ui/IconPicker';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { FieldErrors } from '@/domain/validation';
import { useSubjects } from '@/hooks/use-subjects';

// `null` = campo ainda não editado pelo usuário; nesse caso o valor exibido é o da matéria
// carregada (getAll + find), que chega assincronamente. Evita effect de prefill — e portanto
// re-render em cascata — enquanto a edição é idempotente.
type FieldDraft = string | null;

export default function SubjectFormPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { subjects, create, update, remove } = useSubjects();

  const isEdit = id !== undefined;
  const original = isEdit ? subjects.find((subject) => subject.id === id) : undefined;

  const [nameDraft, setNameDraft] = useState<FieldDraft>(null);
  const [teacherDraft, setTeacherDraft] = useState<FieldDraft>(null);
  const [hourDraft, setHourDraft] = useState<FieldDraft>(null);
  const [iconDraft, setIconDraft] = useState<FieldDraft>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const name = nameDraft ?? original?.name ?? '';
  const teacher = teacherDraft ?? original?.teacher ?? '';
  const hourText = hourDraft ?? (original?.hour === null || original?.hour === undefined
    ? ''
    : String(original.hour));
  const icon = iconDraft ?? original?.icon ?? '';

  function editName(text: string) {
    setNameDraft(text);
    setErrors((previous) => {
      if (previous.name === undefined) return previous;
      const next = { ...previous };
      delete next.name;
      return next;
    });
  }

  function editTeacher(text: string) {
    setTeacherDraft(text);
    setErrors((previous) => {
      if (previous.teacher === undefined) return previous;
      const next = { ...previous };
      delete next.teacher;
      return next;
    });
  }

  function editHour(text: string) {
    setHourDraft(text);
    setErrors((previous) => {
      if (previous.hour === undefined) return previous;
      const next = { ...previous };
      delete next.hour;
      return next;
    });
  }

  async function onSubmit() {
    setSubmitTried(true);
    setBlockMessage(null);
    const trimmed = hourText.trim().replace(',', '.');
    const parsedHour = trimmed === '' ? null : Number(trimmed);
    const input = { name, teacher, hour: parsedHour, icon: icon === '' ? null : icon };
    const result = isEdit ? await update(id, input) : await create(input);
    if (result.ok) {
      router.back();
      return;
    }
    setErrors(result.errors);
  }

  function onConfirmDelete() {
    if (!isEdit) return;
    Alert.alert('Excluir matéria', 'Tem certeza? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            const result = await remove(id);
            if (result.ok) {
              router.back();
              return;
            }
            setBlockMessage(result.reason ?? 'Não foi possível excluir.');
          })();
        },
      },
    ]);
  }

  // `submitTried` guarda o primeiro render: nenhum erro aparece antes do primeiro Salvar.
  const nameError = submitTried ? errors.name : undefined;
  const teacherError = submitTried ? errors.teacher : undefined;
  const hourError = submitTried ? errors.hour : undefined;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={isEdit ? 'Editar matéria' : 'Nova matéria'} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 64, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        <Input label="Nome" value={name} onChangeText={editName} error={nameError} maxLength={80} />
        <Input
          label="Professor(a) (opcional)"
          value={teacher}
          onChangeText={editTeacher}
          error={teacherError}
          maxLength={80}
        />
        <Input
          label="Carga Horária (horas/semana, opcional)"
          value={hourText}
          onChangeText={editHour}
          error={hourError}
          keyboardType="number-pad"
          maxLength={5}
          placeholder="ex: 60"
        />
        <IconPicker selected={icon} onChange={setIconDraft} />

        <View className="mt-two gap-two">
          <View className="w-full">
            <Button label="Salvar" variant="primary" onPress={() => void onSubmit()} />
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
