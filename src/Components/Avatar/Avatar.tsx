import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

type AvatarColor = 'yellow' | 'pink';

const COLOR_PALETTE: Record<AvatarColor, {bg: string; text: string}> = {
  yellow: {bg: '#FFFFCC', text: '#0000CC'},
  pink: {bg: '#FFCCEE', text: '#CC0066'},
};

export const Avatar = ({
  nickname,
  notificationType,
  size = 36,
  color = 'yellow',
}: {
  nickname?: string;
  notificationType?: 'STAMP' | 'LETTER';
  size?: number;
  color?: AvatarColor;
}) => {
  const palette = COLOR_PALETTE[color];

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          backgroundColor: palette.bg,
        },
      ]}>
      {nickname ? (
        <Text style={[styles.avatarText, {color: palette.text}]}>
          {nickname[0].toUpperCase()}
        </Text>
      ) : (
        <Image
          source={
            notificationType === 'STAMP'
              ? require('@assets/Icon/avatar/stamp.png')
              : require('@assets/Icon/avatar/letter.png')
          }
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#0000cc',
  },
  avatarText: {fontFamily: 'Galmuri11-Bold', fontSize: 13},
  image: {
    height: 24,
    width: 24,
  },
});
