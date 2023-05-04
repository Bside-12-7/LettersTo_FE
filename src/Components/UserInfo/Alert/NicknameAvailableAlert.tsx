import React from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {NicknameValidationResult} from '@hooks/UserInfo/useNickname';

type Params = {
  alterOpacity: Animated.Value;
  nicknameValidation: NicknameValidationResult | undefined;
};

export const NicknameAvailableAlert = React.memo(
  ({alterOpacity, nicknameValidation}: Params) => (
    <Animated.View style={[styles.alert, {opacity: alterOpacity}]}>
      {nicknameValidation && (
        <Text
          style={
            nicknameValidation.valid ? styles.alertSuccess : styles.alertFail
          }>
          {nicknameValidation.message}
        </Text>
      )}
    </Animated.View>
  ),
);

const styles = StyleSheet.create({
  alert: {
    marginHorizontal: 24,
  },
  alertSuccess: {
    fontFamily: 'Galmuri11',
    color: '#44ccff',
  },
  alertFail: {
    fontFamily: 'Galmuri11',
    color: '#ff44cc',
  },
});
