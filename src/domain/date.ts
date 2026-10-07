const DDMMYYYY_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const MS_PER_DAY = 86_400_000;

function daysInMonth(month: number, year: number): number {
  // dia 0 do mês seguinte = último dia do mês pedido (fevereiro respeita bissexto)
  return new Date(year, month, 0).getDate();
}

function pad(value: number, size: number): string {
  return String(value).padStart(size, '0');
}

/**
 * Converte 'YYYY-MM-DD' em Date LOCAL (new Date(y, m-1, d)) — sem UTC, sem timezone traps.
 * Retorna null para entrada malformada ou data inexistente.
 */
function toLocalDate(iso: string): Date | null {
  const match = ISO_DATE_PATTERN.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(month, year)) return null;
  return new Date(year, month - 1, day);
}

/** '07/10/2026' -> '2026-10-07'; null se dia/mês/ano inválidos (valida dia contra mês/ano reais). */
export function parseDDMMYYYY(value: string): string | null {
  const match = DDMMYYYY_PATTERN.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (year < 1000) return null; // ano com menos de 4 dígitos
  if (day < 1 || day > daysInMonth(month, year)) return null;
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

/** '2026-10-07' -> '07/10/2026'; entrada fora do padrão é devolvida intacta (nunca lança). */
export function formatDDMMYYYY(iso: string): string {
  const match = ISO_DATE_PATTERN.exec(iso.trim());
  if (!match) return iso;
  return `${pad(Number(match[3]), 2)}/${pad(Number(match[2]), 2)}/${pad(Number(match[1]), 4)}`;
}

/**
 * Máscara de digitação DD/MM/AAAA para TextInput: mantém só dígitos (máx. 8) e insere '/'
 * a cada 2 dígitos ('0710' -> '07/10', '071020' -> '07/10/20'). Pura e idempotente —
 * tolera backspace porque é derivada sempre do valor atual, nunca do anterior.
 */
export function maskDDMMYYYY(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** 'YYYY-MM-DD' de hoje, fuso local do dispositivo. */
export function todayISO(): string {
  const now = new Date();
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1, 2)}-${pad(now.getDate(), 2)}`;
}

/** Diferença em dias (positivo = futuro). Comparação via Date local; inválida -> 0. */
export function daysUntil(iso: string, today?: string): number {
  const target = toLocalDate(iso);
  const base = toLocalDate(today ?? todayISO());
  if (!target || !base) return 0;
  // Math.round protege contra dias de 23h/25h (horário de verão)
  return Math.round((target.getTime() - base.getTime()) / MS_PER_DAY);
}

/**
 * Rótulo PT-BR: hoje -> 'hoje'; 1 -> 'amanhã'; 2..30 -> 'em N dias';
 * 31..364 -> 'em N mês(es)' (aproximado); >364 -> 'em DD/MM/AAAA';
 * -1 -> 'ontem'; <-1 -> 'atrasada N dias'.
 */
export function relativeLabelBR(iso: string, today?: string): string {
  const diff = daysUntil(iso, today);
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  if (diff > 1 && diff <= 30) return `em ${diff} dias`;
  if (diff > 30 && diff <= 364) {
    const months = Math.max(1, Math.round(diff / 30.44));
    return months === 1 ? 'em 1 mês' : `em ${months} meses`;
  }
  if (diff > 364) return `em ${formatDDMMYYYY(iso)}`;
  if (diff === -1) return 'ontem';
  return `atrasada ${Math.abs(diff)} dias`;
}

export function isPast(iso: string, today?: string): boolean {
  return daysUntil(iso, today) < 0;
}
