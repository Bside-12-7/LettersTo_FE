import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

type Props = {
  onPress: () => void;
  disable: boolean;
};

export const NextButton = React.memo(
  ({onPress: onPressNext, disable}: Props) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPressNext}>
        {disable ? (
          <View
            style={{
              width: 50,
              height: 28,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 68, 204, 0.15)',
            }}>
            <Text
              style={{
                fontFamily: 'Galmuri11',
                color: 'white',
              }}>
              다음
            </Text>
          </View>
        ) : (
          <LinearGradient
            colors={['#FF6ECE', '#FF3DBD']}
            style={{
              width: 50,
              height: 28,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Galmuri11',
                color: 'white',
              }}>
              다음
            </Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  },
);
