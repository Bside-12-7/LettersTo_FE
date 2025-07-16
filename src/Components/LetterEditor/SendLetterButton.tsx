import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
const playIcon = require('@assets/Icon/Play/play_white.png');

export const SendLetterButton = ({
  onPress,
  reply,
}: {
  onPress: () => void;
  reply?: boolean;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <LinearGradient
        colors={['#ff6ece', '#ff3dbd']}
        style={{
          marginHorizontal: 16,
          borderRadius: 10,
          height: 52,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontFamily: 'Galmuri11', color: 'white'}}>
          {!reply ? '광고 보고 공개편지 올리기' : '광고 보고 편지 보내기'}
        </Text>
        <Image
          source={playIcon}
          style={{height: 28, width: 28, marginLeft: 8}}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};
