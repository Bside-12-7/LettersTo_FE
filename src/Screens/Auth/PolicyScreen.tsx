import React, {useCallback} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, Text, StyleSheet, SafeAreaView, Platform} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SCREEN_HEIGHT} from '@constants/screen';
import {SignUpButton} from '@components/Auth/SignUpButton';
import {Header2} from '@components/Headers/Header2';
import type {StackParamsList} from '@type/stackParamList';
import {CLICK_BUTTON_EVENT_PARAMS} from '@constants/analytics';

type Props = NativeStackScreenProps<StackParamsList, 'Policy'>;

export function Policy({navigation}: Props) {
  const onPressBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressSignUp = useCallback(() => {
    // TODO: 회원가입 로직
  }, []);

  return (
    <LinearGradient colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}>
      <SafeAreaView
        style={
          Platform.OS === 'android'
            ? styles.container_android
            : styles.container_ios
        }>
        <Header2 onPressBack={onPressBack} />

        <View style={styles.titleBox}>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText}>이용 약관에</Text>
            <Text style={styles.titleText}>동의가 필요해요</Text>
          </View>
        </View>

        <View style={styles.contentWrap}></View>

        <SignUpButton
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.SIGN_UP}
          disable={false}
          onPress={onPressSignUp}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container_ios: {height: SCREEN_HEIGHT},
  container_android: {height: SCREEN_HEIGHT, paddingVertical: 15},
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    position: 'relative',
  },
  titleWrap: {
    height: 100,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
  },
  contentWrap: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 15,
  },
});
