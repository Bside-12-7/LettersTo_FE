import React from 'react';
import {ImageBackground, Text, View} from 'react-native';
const stepImg = require('@assets/Icon/stepIndicator/step.png');

type Props = {
  current: number;
  of: number;
};

export const StepIndicator = React.memo(({current, of}: Props) => {
  const steps: JSX.Element[] = Array.from({length: of}, (_, i) => {
    if (i + 1 === current) {
      return (
        <ImageBackground
          key={i}
          source={stepImg}
          style={{
            height: 20,
            width: 20,
            margin: 6,
            paddingLeft: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Galmuri11-Bold',
              color: 'white',
              fontSize: 10,
            }}>
            {current}
          </Text>
        </ImageBackground>
      );
    }
    return (
      <View
        key={i}
        style={{
          height: 4,
          width: 4,
          margin: 6,
          borderRadius: 2,
          backgroundColor: '#FF44CC44',
        }}
      />
    );
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      {steps}
    </View>
  );
});
