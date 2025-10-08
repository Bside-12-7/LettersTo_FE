import React, {useCallback, useEffect} from 'react';
import {useQuery} from 'react-query';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAuthAction} from '@stores/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserInfo} from '@apis/member';
import {sendAttendance} from '@apis/attendances';
import type {StackParamsList} from '@type/stackParamList';
import mobileAds from 'react-native-google-mobile-ads';
import {getMemberTermsConsent} from '@apis/terms';

type Props = NativeStackScreenProps<StackParamsList, 'Splash'>;

export function Splash({}: Props) {
  const authAction = useAuthAction();

  const loginWithStoredToken = useCallback(async () => {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem('accessToken'),
      AsyncStorage.getItem('refreshToken'),
    ]);
    if (!accessToken || !refreshToken) {
      return Promise.reject('저장된 토큰 없음');
    }
    return getUserInfo();
  }, []);

  const {isError, isLoading, isSuccess} = useQuery(
    'login',
    loginWithStoredToken,
    {
      retry: false,
      onError: (error: any) => {
        console.error('Query Error: ', error.message);
      },
    },
  );

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(async () => {
        mobileAds().setAppMuted(true);
        if (!isLoading) {
          if (isSuccess) {
            authAction.login();
            sendAttendance().catch(() => {});

            // 약관 동의 여부 확인
            try {
              const termsConsent = await getMemberTermsConsent();
              console.log(termsConsent);
              // 필수 약관(이용약관, 개인정보)이 모두 false인지 확인
              const requiredTermsNotAgreed =
                termsConsent.TERMS_OF_SERVICE === false &&
                termsConsent.PRIVACY === false;
              authAction.setTermsAgreed(!requiredTermsNotAgreed);
            } catch (error) {
              console.error('Failed to fetch terms consent:', error);
              authAction.setTermsAgreed(true); // 실패 시 기본값 true
            }
          } else {
            authAction.setTermsAgreed(false);
          }
          authAction.endLoading();
        }
      });
  }, [isSuccess, isError, isLoading, authAction]);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        color={'#6990F7'}
        size={'large'}
        style={styles.activityIndicator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
