import React from 'react';
import {View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@constants/screen';

type Props = {lineColor: string};

const Horizontal = ({lineColor}: Props) => {
  const result = [];
  for (let i = 0; i * 24 < SCREEN_HEIGHT; i++) {
    result.push(
      <View
        key={i}
        style={{
          height: 24,
          width: SCREEN_WIDTH,
          borderTopWidth: 1,
          borderColor: lineColor,
        }}
      />,
    );
  }
  return <>{result}</>;
};

const Vertical = ({lineColor}: Props) => {
  const result = [];
  for (let i = 0; i * 24 < SCREEN_HEIGHT; i++) {
    result.push(
      <View
        key={i}
        style={{
          height: SCREEN_HEIGHT,
          width: 24,
          borderRightWidth: 1,
          borderColor: lineColor,
        }}
      />,
    );
  }
  return <>{result}</>;
};

export const Grid = React.memo(({lineColor}: Props) => {
  return (
    <>
      <View style={{position: 'absolute'}}>
        <Horizontal lineColor={lineColor} />
      </View>
      <View style={{position: 'absolute', flexDirection: 'row'}}>
        <Vertical lineColor={lineColor} />
      </View>
    </>
  );
});
