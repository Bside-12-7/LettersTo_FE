import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
};

export const EditUserInfoButton = React.memo(({text, onPress}: Props) => (
  <View style={styles.userInfoBtn}>
    <Pressable onPress={onPress}>
      <Text style={styles.userInfoBtnText}>{text}</Text>
    </Pressable>
  </View>
));

const styles = StyleSheet.create({
  userInfoBtn: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  userInfoBtnText: {fontFamily: 'Galmuri11', color: 'white', fontSize: 13},
});
