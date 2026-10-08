import { router } from "expo-router";
import { Text, View } from "react-native";

import { ListItem } from "@/components/ui/ListItem";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Subject } from "@/domain/models";
import type { SubjectProgress } from "@/domain/progress";

export interface SubjectProgressRowProps {
  subject: Subject;
  progress: SubjectProgress;
}

/** Linha de matéria no bloco "Progresso": monograma, nome, barra e fração concluída/total. */
export function SubjectProgressRow({
  subject,
  progress,
}: SubjectProgressRowProps) {
  return (
    <ListItem
      onPress={() =>
        router.push(`/subject-form?id=${encodeURIComponent(subject.id)}`)
      }
    >
      <View className="flex-row items-center gap-three">
        <Text className="flex-1 text-body text-text" numberOfLines={1}>
          {subject.name}
        </Text>
        <ProgressBar ratio={progress.ratio} width={120} />
        <Text className="text-meta text-text-secondary">
          {progress.done}/{progress.total}
        </Text>
      </View>
    </ListItem>
  );
}
