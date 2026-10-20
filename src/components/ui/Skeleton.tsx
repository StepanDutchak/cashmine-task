import { useEffect, useRef } from 'react';
import { Animated, DimensionValue, Platform, StyleSheet } from 'react-native';

import { colors, radius } from '@/theme/tokens';

const PULSE_DURATION_MS = 700;
const MIN_OPACITY = 0.45;

type SkeletonProps = {
  width?: DimensionValue;
  height: number;
};

export const Skeleton = ({ width = '100%', height }: SkeletonProps) => {
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

  return <Animated.View style={[styles.block, { width, height, opacity }]} />;
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.skeleton,
    borderRadius: radius.sm,
  },
});
