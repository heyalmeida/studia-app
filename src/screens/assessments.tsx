import { View } from "react-native";

import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function AssessmentsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Avaliações" />
      <EmptyState title="Nenhuma avaliação ainda." text="" />
    </View>
  );
}
