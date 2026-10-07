import { router } from "expo-router";
import { View } from "react-native";

import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function DashboardPage() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Painel" />
      <EmptyState
        title="Bem-vindo ao Studia"
        text="Cadastre sua primeira matéria para começar."
        actionLabel="Criar uma Matéria"
        onAction={() => router.push("/subject-form")}
      />
    </View>
  );
}
