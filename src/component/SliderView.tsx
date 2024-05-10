import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';

const SliderView: React.FC = () => {
  const [distValue, setDistValue] = useState(50.0);

  console.log("SliderView - here: " + distValue)

  return (
    <Slider
      containerStyle={{ marginHorizontal: 16, marginBottom: 12 }}
      trackStyle={{ height: 6 }}
      thumbStyle={styles.thumbStyle}
      step={1}
      minimumValue={0}
      maximumValue={100}
      thumbTintColor="#f1b225"
      minimumTrackTintColor="#f1b225"
      maximumTrackTintColor="lightgrey"
      animateTransitions
      animationType="spring"
      value={distValue}
      renderAboveThumbComponent={() => (
        <Text style={[styles.thumbText, { right: distValue }]}>
          Less than {(distValue / 10).toFixed(1)} km
        </Text>
      )}
      onValueChange={value => setDistValue(value[0])}
    />
  );
};

const styles = StyleSheet.create({
  thumbStyle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 7.49,
  },
  thumbText: {
    width: 170,
    color: 'black',
    textAlign: 'center',
  },
});

export default SliderView;
