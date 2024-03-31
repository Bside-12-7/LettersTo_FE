import React from 'react';
import {Image, ImageBackground, TouchableOpacity} from 'react-native';
import {SCREEN_WIDTH} from '@constants/screen';
import {getImageUrl} from '@utils/image';

export function StampButton({stamp, onPress: selectStamp}: any) {
  return (
    <TouchableOpacity
      onPress={() => {
        selectStamp(stamp.id);
      }}
      activeOpacity={0.7}
      style={{
        width: (SCREEN_WIDTH - 30) / 3,
        padding: 10,
      }}>
      <ImageBackground
        source={require('@assets/stamp.png')}
        style={{
          width: '100%',
          height: undefined,
          aspectRatio: 94 / 116,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          // source={stamp.image}
          source={{uri: getImageUrl(stamp.fileId)}}
          style={{
            width: '85%',
            height: undefined,
            aspectRatio: 94 / 116,
            backgroundColor: '#0000cc13',
          }}
        />
      </ImageBackground>
    </TouchableOpacity>
  );
}
