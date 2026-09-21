import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * usePulse — a looping "breathing" value that eases between `min` and `max`.
 * Returns an Animated.Value; bind it to `opacity` (native-driver safe) on a glow/border overlay.
 * While `enabled` is false nothing runs and the value rests at `max`.
 */
export function usePulse({ enabled = true, duration = 1400, min = 0.2, max = 1 } = {}) {
  const value = useRef(new Animated.Value(max)).current;

  useEffect(() => {
    if (!enabled) {
      value.setValue(max);
      return undefined;
    }

    const step = (toValue) =>
      Animated.timing(value, { toValue, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
    const loop = Animated.loop(Animated.sequence([step(min), step(max)]));
    loop.start();
    return () => loop.stop();
  }, [enabled, duration, min, max, value]);

  return value;
}
