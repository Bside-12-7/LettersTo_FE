import * as React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '../types';

type Props = {
  navigation: NativeStackNavigationProp<StackParamsList, keyof StackParamsList>;
  title: string;
};

export function Header({navigation, title}: Props) {
  function goback() {
    navigation.pop();
  }

  return (
    <View style={styles.headerWrap}>
      <TouchableWithoutFeedback onPress={() => goback()}>
        <View style={styles.backButton}>
          <Text style={styles.backButtonText}>{' < '}</Text>
        </View>
      </TouchableWithoutFeedback>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 10,
    width: 40,
  },
  backButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 35,
  },
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000cc',
  },
});
