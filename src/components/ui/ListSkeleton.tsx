import { View } from 'react-native';

import { Card } from '@/components/ui/Card';

export interface ListSkeletonProps {
  height: number;
  count?: number;
}

/**
 * Skeleton de carregamento: cards vazios de altura fixa, sem spinner colorido
 * (identidade monocromática — estados sem cor, visual-identity §2).
 */
export function ListSkeleton({ height, count = 3 }: ListSkeletonProps) {
  return (
    <View className="flex-1 px-four pb-four">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} style={{ height, marginBottom: 16 }}>
          {null}
        </Card>
      ))}
    </View>
  );
}
