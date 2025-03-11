import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function test() {
  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });

  const handleTouch = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setCoordinates({ x: locationX, y: locationY });
  };

  return (
    <View style={styles.container}>
      <Text>Touch coordinates:</Text>
      <Text>X: {coordinates.x}</Text>
      <Text>Y: {coordinates.y}</Text>
      <View
        style={styles.touchableArea}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleTouch} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableArea: {
    width: 200,
    height: 200,
    backgroundColor: 'lightblue',
    marginTop: 20,
  },
});
