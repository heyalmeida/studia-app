import { View } from 'react-native';

import { Card } from '@/components/ui/Card';

export interface ListSkeletonProps {
  height: number;
  count?: number;
}

/**
 * Skeleton de carregamento: cards vazios de altura fixa, sem spinner colorido — os
 * estados de espera seguem a mesma superfície da lista real (ADR-0009).
 */
export function ListSkeleton({ height, count = 3 }: ListSkeletonProps) {
  return (
    <View className="flex-1 gap-3 px-5 pb-4">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} style={{ height }} bare>
          {null}
        </Card>
      ))}
    </View>
  );
}