import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export const Avatar = ({
  nickname,
  notificationType,
}: {
  nickname?: string;
  notificationType?: 'STAMP' | 'LETTER';
}) => {
  return (
    <View style={styles.avatar}>
      {nickname ? (
        <Text style={styles.avatarText}>{nickname[0].toUpperCase()}</Text>
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
    width: 36,
    height: 36,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFCC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#0000cc',
  },
  avatarText: {fontFamily: 'Galmuri11-Bold', fontSize: 13, color: '#0000CC'},
  image: {
    height: 24,
    width: 24,
  },
});
