import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  disable: boolean;
  onPress: () => void;
  buttonStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  providerName: string;
  providerLogo: ImageSourcePropType;
}

export const AuthButton = React.memo((props: Props) => {
  return (
    <TouchableWithoutFeedback disabled={props.disable} onPress={props.onPress}>
      <View style={[styles.loginButton, props.buttonStyle]}>
        <Image source={props.providerLogo} style={styles.authIcon} />
        <Text style={[styles.loginText, props.textStyle]}>
          {props.providerName}로 시작하기
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  loginButton: {
    width: 327,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    borderRadius: 10,
  },
  authIcon: {height: 20, width: 20, marginRight: 8},
  loginText: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
  },
});
