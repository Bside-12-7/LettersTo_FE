import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {BackButton} from '../Button/Header/BackButton';
import {NextButton} from '../Button/Header/NextButton';
import {useCallback} from 'react';

type Props = {
  navigation: NativeStackNavigationProp<StackParamsList, keyof StackParamsList>;
  title?: string;
  color?: 'blue' | 'white';
  next?: keyof StackParamsList;
  onPressNext?: () => void;
  disableNext?: boolean;
  style?: object;
};

export const Header = React.memo(
  ({
    navigation,
    title,
    color = 'blue',
    next,
    onPressNext: processBeforeNext,
    disableNext,
    style,
  }: Props) => {
    function goBack() {
      navigation.pop();
    }

    const goNext = useCallback(() => {
      if (next) {
        navigation.navigate(next);
      }
    }, [navigation, next]);

    const processAndNext = useCallback(() => {
      if (processBeforeNext) {
        processBeforeNext();
      }
      goNext();
    }, [goNext, processBeforeNext]);

    return (
      <View style={[styles.headerWrap, style]}>
        <BackButton color={color} onPress={goBack} />
        <View style={styles.titleWrap}>
          <Text
            style={[
              styles.title,
              {color: color === 'blue' ? '#0000cc' : 'white'},
            ]}>
            {title}
          </Text>
        </View>
        {next && disableNext !== undefined ? (
          <NextButton onPress={processAndNext} disable={disableNext} />
        ) : (
          <View style={{width: 50}} />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  headerWrap: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 35,
  },
  titleWrap: {justifyContent: 'center'},
  title: {fontFamily: 'Galmuri11', fontSize: 15},
});
