import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { Button, Dimensions, View } from "react-native";
import React from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import { GridLines } from "./GridLines";

const gridWidth = Dimensions.get('window').width;
const snapToInterval = gridWidth / 3;
const gridHeight = Dimensions.get('window').height - 80;

function clamp(value: number, min: number, max: number) {
  'worklet';
  const upperClamped = Math.min(value, max);
  return Math.max(upperClamped, min);
}

export default function AnimatedStyleUpdateExample(props) {
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<{
    startX: number;
    startY: number;
  }>({
    onActive: (event, context) => {
      x.value = context.startX + event.translationX;
      y.value = context.startY + event.translationY;
    },
    onStart: (_, context) => {
      context.startX = x.value;
      context.startY = y.value;
    },
    onEnd: () => {
      const targetX = Math.round(x.value / snapToInterval) * snapToInterval;
      const maxX = Math.floor(gridWidth / snapToInterval) * snapToInterval - snapToInterval;
      const clampedX = clamp(targetX, 0, maxX);

      const targetY = Math.round(y.value / snapToInterval) * snapToInterval;
      const maxY = Math.floor(gridHeight / snapToInterval)  * snapToInterval - snapToInterval;
      const clampedY = clamp(targetY, 0, maxY);

      x.value = withTiming(clampedX, config);
      y.value = withTiming(clampedY, config);
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      transform: [
        {translateX: x.value},
        {translateY: y.value}
      ]
    }
  })

  return (
    <View
      style={{
        flex: 1,
        alignItems: "stretch",
        flexDirection: "column",
      }}
    >
      <View style={{
        height: gridHeight,
        marginTop: 50,
        backgroundColor: `rgba(0, 255, 255, 0.3)`
      }}>
        <GridLines
          intervalX={snapToInterval}
          intervalY={snapToInterval}
        />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {width: snapToInterval, height: snapToInterval, backgroundColor: "black"},
              animatedStyle,
            ]}
            />
        </PanGestureHandler>
      </View>
      <Button
        title="reset"
        onPress={() => {
          x.value = withTiming(0, config);
          y.value = withTiming(0, config);
        }}
      />
    </View>
  );
}
