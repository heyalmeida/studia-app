import { Text, View } from 'react-native';

import { monogram } from '@/domain/monogram';

export interface MonogramProps {
  name: string;
  size?: 'sm' | 'md';
}

export function Monogram({ name, size = 'md' }: MonogramProps) {
  const dimension = size === 'sm' ? 32 : 40;

  return (
    <View
      className="items-center justify-center rounded-monogram border border-border-strong p-half"
      style={{ width: dimension, height: dimension }}>
      <Text
        className={size === 'sm' ? 'text-meta text-text' : 'text-body font-semibold text-text'}
        style={{ textAlign: 'center' }}>
        {monogram(name)}
      </Text>
    </View>
  );
}
