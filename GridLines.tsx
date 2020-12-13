import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

function range(length: number) {
  return (new Array(length)).fill(null).map((_, i) => i);
}

export function GridLines({
  intervalX,
  intervalY
}: {
  intervalX: number;
  intervalY: number;
}) {
  const [layout, setLayout] = useState<{width: number; height: number;}>();
  const lines = useMemo(() => {
    if (!layout) {
      return {
        horizontal: 0,
        vertical: 0
      }
    }
    const horizontal = Math.ceil(layout.width / intervalX);
    const vertical = Math.ceil(layout.height / intervalY);

    return {horizontal, vertical};
  }, [layout]);

  const onLayout = useCallback(({nativeEvent: {layout: {width, height}}}: LayoutChangeEvent) => {
    setLayout({width, height});
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
      {range(lines.vertical).map(index => (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: index * intervalY,
            height: 2,
            backgroundColor: 'gray'
          }}
        />
      ))}
      {range(lines.horizontal).map(index => (
         <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: index * intervalX,
            width: 2,
            backgroundColor: 'gray'
          }}
       />
      ))}
    </View>
  )
}
