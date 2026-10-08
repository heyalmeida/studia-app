import type { ReactNode } from "react";
import { Text, View } from "react-native";

export interface DashCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  children?: ReactNode;
}

/** Card de resumo do painel (Slice 6): borda hairline, sem sombra (ADR-0006). */
export function DashCard({ title, value, subtitle, children }: DashCardProps) {
  return (
    <View
      className="rounded-card border border-gray-800 bg-surface p-three"
      style={{ gap: 16 }}
    >
      <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
        {title}
      </Text>
      {value !== undefined ? (
        <Text className="text-metric font-bold text-text">{value}</Text>
      ) : null}
      {subtitle !== undefined ? (
        <Text className="text-meta text-text-tertiary">{subtitle}</Text>
      ) : null}
      {children}
    </View>
  );
}
