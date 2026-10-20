import { useEffect, useRef } from 'react';
import { Animated, DimensionValue, Platform, StyleSheet } from 'react-native';

import { colors, radius } from '@/theme/tokens';

const PULSE_DURATION_MS = 700;
const MIN_OPACITY = 0.45;

type SkeletonProps = {
  width?: DimensionValue;
  height: number;
  color?: string;
};

export const Skeleton = ({ width = '100%', height, color = colors.skeleton }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: MIN_OPACITY, duration: PULSE_DURATION_MS, useNativeDriver }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_DURATION_MS, useNativeDriver }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, { width, height, opacity, backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  block: {
    borderRadius: radius.sm,
  },
});
