import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from '@components/Avatar/Avatar';

type Props = {
  nickname: string;
};

export const Profile = React.memo(({nickname}: Props) => (
  <View style={styles.nickname}>
    <Avatar nickname={nickname} />
    <Text style={styles.nicknameText}>{nickname}</Text>
  </View>
));

const styles = StyleSheet.create({
  nickname: {flexDirection: 'row', alignItems: 'center'},
  nicknameText: {fontFamily: 'Galmuri11', fontSize: 16, color: 'white'},
});
