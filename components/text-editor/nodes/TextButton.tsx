import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withSpring } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedButton = () => {
  const toggled = useSharedValue(true);

  const animatedProps = useAnimatedProps(() => ({
    d: withSpring(toggled.value ? "M 5 5 L 19 19 M 19 5 L 5 19" : "M 6 4 H 18 M 12 4 V 20", {duration:300})
    
  }));

  const toggleIcon = () => {
    toggled.value = !toggled.value;
  };

  return (
    <Pressable onPress={toggleIcon} style={styles.button}>
      <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <AnimatedPath animatedProps={animatedProps} />
      </Svg>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default AnimatedButton;
