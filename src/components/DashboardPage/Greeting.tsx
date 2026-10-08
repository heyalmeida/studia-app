import { Text, View } from 'react-native';

const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function greetingFor(hour: number): string {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Saudação curta + data por extenso (ADR-0009). É o topo do painel: uma linha de
 * contexto antes dos números, sem repetir nenhum dado dos cards abaixo.
 */
export function Greeting({ now = new Date() }: { now?: Date }) {
  const date = `${WEEKDAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;

  return (
    <View style={{ gap: 4 }}>
      <Text className="text-title font-bold text-text">{greetingFor(now.getHours())}</Text>
      <Text className="text-body capitalize text-text-secondary">{date}</Text>
    </View>
  );
}