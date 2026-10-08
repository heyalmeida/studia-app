export type ActivityType = 'tarefa' | 'trabalho' | 'leitura' | 'estudo';
export type ActivityStatus = 'pendente' | 'concluida';
export type AssessmentStatus = 'agendada' | 'realizada';

export interface Subject {
  id: string;
  name: string;
  teacher: string | null;
  hour: number | null; // horas por semana; null = não informado
  icon: string | null; // nome do ícone do IconPicker (ex: 'BookOpen') ou ''; '' tratado como null
  /** Tom da paleta de 8 (SUBJECT_COLORS) ou null = sem cor escolhida (ADR-0009). */
  color: string | null;
  createdAt: string; // ISO 8601 completo
}

export interface Activity {
  id: string;
  subjectId: string;
  title: string;
  type: ActivityType;
  description: string | null;
  dueDate: string | null; // 'YYYY-MM-DD' (somente data)
  status: ActivityStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface Assessment {
  id: string;
  subjectId: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  status: AssessmentStatus;
  createdAt: string;
}

export const ACTIVITY_TYPES: ActivityType[] = ['tarefa', 'trabalho', 'leitura', 'estudo'];
