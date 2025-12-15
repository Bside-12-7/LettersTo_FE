import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAuthAction} from '@stores/auth';
import type {StackParamsList} from '@type/stackParamList';
import mobileAds from 'react-native-google-mobile-ads';
import {checkForcedUpdate} from '@apis/appVersion';
import {ForceUpdateModal} from '@components/Modals/ForceUpdateModal';
import DeviceInfo from 'react-native-device-info';

type Props = NativeStackScreenProps<StackParamsList, 'Splash'>;

// 앱 전체에서 한 번만 강제 업데이트 체크하도록 전역 플래그
let forceUpdateChecked = false;
let forceUpdateResult = false;

export function Splash({}: Props) {
  const authAction = useAuthAction();
  const [updateCheckComplete, setUpdateCheckComplete] = useState(
    forceUpdateChecked,
  );
  const [showForceUpdate, setShowForceUpdate] = useState(forceUpdateResult);

  // 강제 업데이트 체크 (앱 최초 실행 시 1회만)
  useEffect(() => {
    if (forceUpdateChecked) {
      // 이미 체크했으면 저장된 결과 사용
      setUpdateCheckComplete(true);
      setShowForceUpdate(forceUpdateResult);
      return;
    }

    const checkUpdate = async () => {
      try {
        const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
        const currentVersion = DeviceInfo.getVersion();
        const currentBuildNumber = parseInt(DeviceInfo.getBuildNumber(), 10);

        const result = await checkForcedUpdate({
          platform,
          currentVersion,
          currentBuildNumber,
        });

        forceUpdateResult = result.shouldForceUpdate;
        setShowForceUpdate(result.shouldForceUpdate);
      } catch (error) {
        console.error('Failed to check force update:', error);
        // 에러 발생 시에도 앱 진입 허용 (관대한 정책)
        forceUpdateResult = false;
        setShowForceUpdate(false);
      } finally {
        // 성공/실패 여부와 관계없이 체크 완료 표시
        forceUpdateChecked = true;
        setUpdateCheckComplete(true);
      }
    };

    checkUpdate();
  }, []);

  useEffect(() => {
    // 강제 업데이트가 필요한 경우 로그인 로직 실행 안 함
    if (showForceUpdate || !updateCheckComplete) {
      return;
    }

    mobileAds()
      .initialize()
      .then(async () => {
        mobileAds().setAppMuted(true);

        // 자동 로그인 시도 (내부에서 약관 동의 여부도 함께 확인함)
        await authAction.loginWithExistTokens();
      });
  }, [authAction, showForceUpdate, updateCheckComplete]);

  const handlePressUpdate = useCallback(() => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id6444780538',
      android: 'https://play.google.com/store/apps/details?id=com.lettersto',
    });

    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  }, []);

  return (
    <View style={styles.container}>
      {!showForceUpdate && (
        <ActivityIndicator
          animating={true}
          color={'#6990F7'}
          size={'large'}
          style={styles.activityIndicator}
        />
      )}
      <ForceUpdateModal
        isVisible={showForceUpdate}
        onPressUpdate={handlePressUpdate}
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
