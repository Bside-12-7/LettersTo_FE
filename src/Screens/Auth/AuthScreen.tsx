import React, {useCallback} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import type {StackParamsList} from '@type/stackParamList';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {verifyProviderToken} from '@apis/token';
import {
  KakaoOAuthToken,
  login as loginWithKakaoOAuth,
} from '@react-native-seoul/kakao-login';
import appleAuth from '@invertase/react-native-apple-authentication';
import {onPressPrivacyPolicy, onPressTermsOfService} from '@utils/hyperlink';

import Toast from '@components/Toast/toast';
import {ProviderToken} from '@type/auth';
import {useAuthAction} from '@stores/auth';
import {AuthButton} from '@components/Auth/AuthButton';
import {Logo} from '@components/Logo/LogoAnimation';
import {PolicyNotice} from '@components/Auth/PolicyNoticeText';

const kakaoLogo = require('@assets/Image/social/kakao.png');
const appleLogo = require('@assets/Image/social/apple.png');

type Props = NativeStackScreenProps<StackParamsList, 'Auth'>;

const isKakaoOAuthTokenType = (arg: any): arg is KakaoOAuthToken => {
  return arg.idToken !== undefined;
};

export function Auth({navigation}: Props) {
  const authAction = useAuthAction();

  const [disableSignUp, setDisableSignUp] = useState(false);

  const loginWithProvider = useCallback(
    async (providerToken: ProviderToken) => {
      const authTokens = await verifyProviderToken(providerToken);

      if (authTokens.verified === false && authTokens.registerToken) {
        // 회원가입 폼으로 이동
        authAction.initRegisterInfo(authTokens.registerToken);
        navigation.navigate('NicknameForm');
      } else if (authTokens.accessToken && authTokens.refreshToken) {
        // 토큰을 사용하여 로그인
        await Promise.all([
          AsyncStorage.setItem('accessToken', authTokens.accessToken),
          AsyncStorage.setItem('refreshToken', authTokens.refreshToken),
        ]);
        authAction.loginWithExistTokens();
      }
    },
    [authAction, navigation],
  );

  const onPressSignUpWithKaKao = useCallback(async () => {
    setDisableSignUp(true);
    try {
      const kakaoOAuthToken = await loginWithKakaoOAuth();
      if (!isKakaoOAuthTokenType(kakaoOAuthToken)) {
        throw new Error('KakaoOAuthToken 형식이 아님');
      }

      const providerToken: ProviderToken = {
        idToken: kakaoOAuthToken.idToken,
        providerType: 'KAKAO',
      };

      await loginWithProvider(providerToken);
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다.');
    } finally {
      setDisableSignUp(false);
    }
  }, [loginWithProvider]);

  const onPressSignUpWithApple = useCallback(async () => {
    setDisableSignUp(true);
    try {
      if (!appleAuth.isSupported) {
        throw new Error('애플 로그인을 지원하지 않는 기기입니다.');
      }

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('애플 로그인 연동에 실패했습니다.');
      }

      const providerToken: ProviderToken = {
        idToken: appleAuthRequestResponse.identityToken,
        providerType: 'APPLE',
      };

      await loginWithProvider(providerToken);
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다.');
    } finally {
      setDisableSignUp(false);
    }
  }, [loginWithProvider]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView style={styles.container}>
        <Logo />
        <View style={styles.buttonWrap}>
          <AuthButton
            providerName={'카카오'}
            providerLogo={kakaoLogo}
            disable={disableSignUp}
            onPress={onPressSignUpWithKaKao}
            buttonStyle={styles.kakaoLoginButton}
            textStyle={styles.kakaoLoginText}
          />
          {Platform.OS === 'ios' && (
            <AuthButton
              providerName={'Apple'}
              providerLogo={appleLogo}
              disable={disableSignUp}
              onPress={onPressSignUpWithApple}
              buttonStyle={styles.appleLoginButton}
              textStyle={styles.appleLoginText}
            />
          )}
        </View>
        <PolicyNotice
          onPressPrivacyPolicy={onPressPrivacyPolicy}
          onPressTermsOfService={onPressTermsOfService}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0000CC'},
  buttonWrap: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: 327,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    borderRadius: 10,
  },
  kakaoLoginButton: {backgroundColor: '#F9E54C'},
  appleLoginButton: {backgroundColor: 'black'},
  emailLoginButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0000cc',
  },
  loginText: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
  },
  kakaoLoginText: {color: 'black'},
  appleLoginText: {color: 'white'},
  emailLoginText: {color: '#0000cc'},
  authIcon: {height: 20, width: 20, marginRight: 8},
});
