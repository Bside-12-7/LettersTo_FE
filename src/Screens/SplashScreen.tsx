// Import React and Component
import React, {useCallback, useEffect} from 'react';
import {useQuery} from 'react-query';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamsList} from '../types/stackParamList';
import {useAuthAction} from '../Store/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserInfo} from '../APIs/member';
import {sendAttendance} from '../APIs/attendances';

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
    ['login'],
    loginWithStoredToken,
    {retry: false},
  );

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        authAction.login();
        sendAttendance();
      }
      authAction.endLoading();
    }
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