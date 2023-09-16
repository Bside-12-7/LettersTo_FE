import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type Props = {
  onPress: () => void;
  children: string;
};

export const ShareButton = ({onPress, children}: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <LinearGradient colors={['#FF6ECE', '#FF3DBD']} style={[styles.button]}>
        <Text style={styles.buttonText}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC7F0',
  },
  buttonText: {fontFamily: 'Galmuri11', color: 'white'},
});
