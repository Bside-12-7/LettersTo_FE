import React from 'react';
import {Pressable, StyleProp, Text, TextStyle, ViewStyle} from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
};

export const BottomButton = React.memo(
  ({children, onPress, style, textStyle}: Props) => (
    <Pressable style={style} onPress={onPress}>
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  ),
);
