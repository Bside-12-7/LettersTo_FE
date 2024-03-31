import {withButtonClickEventLogger} from '@components/Button/withButtonClickEventLogger';
import React from 'react';
import {View, TouchableWithoutFeedback, Text, StyleSheet} from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
};

const EditUserInfoButtonWithoutLogger = React.memo(({text, onPress}: Props) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.userInfoBtn}>
      <Text style={styles.userInfoBtnText}>{text}</Text>
    </View>
  </TouchableWithoutFeedback>
));

export const EditUserInfoButton = withButtonClickEventLogger<Props>(
  EditUserInfoButtonWithoutLogger,
);

const styles = StyleSheet.create({
  userInfoBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoBtnText: {fontFamily: 'Galmuri11', color: 'white', fontSize: 13},
});
