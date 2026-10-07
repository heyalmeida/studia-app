import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacing, Typography } from '@/constants/theme';
import type { FieldErrors } from '@/domain/validation';
import { useSubjects } from '@/hooks/use-subjects';
import { useTheme } from '@/hooks/use-theme';

// `null` = campo ainda não editado pelo usuário; nesse caso o valor exibido é o da matéria
// carregada (getAll + find), que chega assincronamente. Evita effect de prefill — e portanto
// re-render em cascata — enquanto a edição é idempotente.
type FieldDraft = string | null;

export default function SubjectFormScreen() {
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { subjects, create, update, remove } = useSubjects();

  const isEdit = id !== undefined;
  const original = isEdit ? subjects.find((subject) => subject.id === id) : undefined;

  const [nameDraft, setNameDraft] = useState<FieldDraft>(null);
  const [teacherDraft, setTeacherDraft] = useState<FieldDraft>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const name = nameDraft ?? original?.name ?? '';
  const teacher = teacherDraft ?? original?.teacher ?? '';

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

  async function onSubmit() {
    setSubmitTried(true);
    setBlockMessage(null);
    const input = { name, teacher };
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

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={isEdit ? 'Editar matéria' : 'Nova matéria'} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Input
          label="Nome"
          value={name}
          onChangeText={editName}
          error={nameError}
          maxLength={80}
        />
        <Input
          label="Professor(a) (opcional)"
          value={teacher}
          onChangeText={editTeacher}
          error={teacherError}
          maxLength={80}
        />

        <View style={styles.actions}>
          <View style={styles.fullWidth}>
            <Button label="Salvar" variant="primary" onPress={() => void onSubmit()} />
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
