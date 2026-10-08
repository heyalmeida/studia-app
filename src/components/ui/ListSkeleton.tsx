import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SCREEN_PADDING, Spacing } from '@/constants/theme';

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
    <View style={styles.wrapper}>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} style={{ height }} bare>
          {null}
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: Spacing.three,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: Spacing.four,
  },
});