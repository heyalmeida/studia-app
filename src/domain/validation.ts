import { isPast, parseDDMMYYYY } from '@/domain/date';

export interface SubjectFormInput {
  name: string;
  teacher: string;
}

export interface FieldErrors {
  [field: string]: string;
}

export interface ActivityFormInput {
  title: string;
  subjectId: string;
  dueDate: string; // 'DD/MM/AAAA', '' se ausente
}

export interface AssessmentFormInput {
  title: string;
  subjectId: string;
  date: string; // 'DD/MM/AAAA'
}

/**
 * Valida o nome da matéria (RF-01). `existingNames` deve vir SEM o da matéria em edição
 * (quem chama é responsável por isso). Objeto vazio = válido.
 */
export function validateSubject(input: SubjectFormInput, existingNames: string[]): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();

  if (name.length === 0) {
    errors.name = 'Informe o nome da matéria.';
    return errors;
  }
  if (name.length < 2) {
    errors.name = 'O nome precisa ter pelo menos 2 caracteres.';
    return errors;
  }

  const normalized = name.toLowerCase();
  const duplicated = existingNames.some((existing) => existing.trim().toLowerCase() === normalized);
  if (duplicated) {
    errors.name = 'Já existe uma matéria com esse nome.';
  }
  return errors;
}

/**
 * Valida o formulário de atividade (RF-04). `dueDateWarning` é aviso não-bloqueante:
 * data passada continua sendo um valor aceitável.
 */
export function validateActivity(
  input: ActivityFormInput,
  hasSubjects: boolean,
): FieldErrors & { dueDateWarning?: string } {
  const errors: FieldErrors & { dueDateWarning?: string } = {};

  if (input.title.trim().length === 0) {
    errors.title = 'Informe um título.';
  }

  if (!hasSubjects) {
    errors.subjectId = 'Cadastre uma matéria antes de criar atividades.';
  } else if (input.subjectId.trim().length === 0) {
    errors.subjectId = 'Selecione uma matéria.';
  }

  const dueDate = input.dueDate.trim();
  if (dueDate.length > 0) {
    const iso = parseDDMMYYYY(dueDate);
    if (iso === null) {
      errors.dueDate = 'Data inválida. Use o formato DD/MM/AAAA.';
    } else if (isPast(iso)) {
      errors.dueDateWarning = 'Esta data está no passado.';
    }
  }

  return errors;
}

/**
 * Valida o formulário de avaliação (RF-08). `dateWarning` é aviso não-bloqueante.
 * Diferente de Activity, a data da avaliação é obrigatória.
 */
export function validateAssessment(
  input: AssessmentFormInput,
  hasSubjects: boolean,
): FieldErrors & { dateWarning?: string } {
  const errors: FieldErrors & { dateWarning?: string } = {};

  if (input.title.trim().length === 0) {
    errors.title = 'Informe o título da avaliação.';
  }

  if (!hasSubjects) {
    errors.subjectId = 'Cadastre uma matéria antes de criar atividades.';
  } else if (input.subjectId.trim().length === 0) {
    errors.subjectId = 'Selecione uma matéria.';
  }

  const date = input.date.trim();
  if (date.length === 0) {
    errors.date = 'Informe a data. Use o formato DD/MM/AAAA.';
  } else {
    const iso = parseDDMMYYYY(date);
    if (iso === null) {
      errors.date = 'Data inválida. Use o formato DD/MM/AAAA.';
    } else if (isPast(iso)) {
      errors.dateWarning = 'Esta data está no passado.';
    }
  }

  return errors;
}
