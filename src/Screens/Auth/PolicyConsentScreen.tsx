import React, {useCallback, useState, useMemo, useEffect} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SCREEN_HEIGHT} from '@constants/screen';
import {SignUpButton} from '@components/Auth/SignUpButton';
import {BackButton} from '@components/Button/Header/BackButton';
import type {StackParamsList} from '@type/stackParamList';
import {CLICK_BUTTON_EVENT_PARAMS} from '@constants/analytics';
import {useQuery, useMutation} from 'react-query';
import {
  ConsentItem,
  getTerms,
  recordTermsReAgreement,
} from '@apis/terms';
import Toast from '@components/Toast/toast';
import {WebView} from 'react-native-webview';
import {BASE_URL_TEST} from '@constants/common';
import {useAuthAction} from '@stores/auth';

const checkboxChecked = require('@assets/checkbox_checked.png');
const checkboxUnchecked = require('@assets/checkbox_unchecked.png');

type Props = NativeStackScreenProps<StackParamsList, 'PolicyConsent'>;

export function PolicyConsent({navigation}: Props) {
  const [allAgreed, setAllAgreed] = useState(false);
  const [termsOfService, setTermsOfService] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');

  const {setTermsAgreed} = useAuthAction();

  // 약관 정보 가져오기
  const {data: termsData} = useQuery('terms', getTerms);

  const openTermsWebView = useCallback((termsType: string) => {
    setWebViewUrl(`${BASE_URL_TEST}/terms/html?termsType=${termsType}`);
    setWebViewVisible(true);
  }, []);

  const closeWebView = useCallback(() => {
    setWebViewVisible(false);
  }, []);

  // 전체 동의 체크 시 모든 약관 동의
  const handleAllAgreed = useCallback(() => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTermsOfService(newValue);
    setPrivacy(newValue);
    setMarketing(newValue);
  }, [allAgreed]);

  // 개별 약관 동의 토글
  const toggleTermsOfService = useCallback(() => {
    setTermsOfService(prev => !prev);
  }, []);

  const togglePrivacy = useCallback(() => {
    setPrivacy(prev => !prev);
  }, []);

  const toggleMarketing = useCallback(() => {
    setMarketing(prev => !prev);
  }, []);

  // 필수 약관이 모두 동의되었는지 확인
  const isRequiredAgreed = useMemo(() => {
    return termsOfService && privacy;
  }, [termsOfService, privacy]);

  // 모든 약관이 동의되면 전체 동의 체크
  useEffect(() => {
    if (termsOfService && privacy && marketing) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }, [termsOfService, privacy, marketing]);

  const {mutate: mutateRecordTerms, isLoading} = useMutation(
    ['recordTermsReAgreement'],
    useCallback(async () => {
      // 약관 동의 정보 생성
      const now = new Date().toISOString().replace('Z', '');

      // 약관별 버전 정보 찾기
      const termsOfServiceVersion =
        termsData?.find(t => t.termsType === 'TERMS_OF_SERVICE')
          ?.termsVersionNumber || 1;
      const privacyVersion =
        termsData?.find(t => t.termsType === 'PRIVACY')?.termsVersionNumber ||
        1;

      const consents: ConsentItem[] = [
        {
          termsType: 'TERMS_OF_SERVICE',
          termsVersionNumber: termsOfServiceVersion,
          agreed: termsOfService,
          requestedAt: now,
        },
        {
          termsType: 'PRIVACY',
          termsVersionNumber: privacyVersion,
          agreed: privacy,
          requestedAt: now,
        },
      ];

      if (marketing) {
        const marketingVersion =
          termsData?.find(t => t.termsType === 'MARKETING')
            ?.termsVersionNumber || 1;
        consents.push({
          termsType: 'MARKETING',
          termsVersionNumber: marketingVersion,
          agreed: privacy,
          requestedAt: now,
        });
      }

      await recordTermsReAgreement({consents});
    }, [termsOfService, privacy, marketing, termsData]),
    {
      onSuccess: () => {
        Toast.show('약관 동의가 완료되었어요!');
        // Zustand store에 약관 동의 상태 업데이트
        setTermsAgreed(true);
      },
      onError: () => {
        Toast.show('약관 동의 중 오류가 발생했어요.');
      },
    },
  );

  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressConfirm = useCallback(async () => {
    if (isLoading) {
      return Toast.show('처리중이에요!');
    }

    mutateRecordTerms();
  }, [isLoading, mutateRecordTerms]);

  return (
    <LinearGradient colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}>
      <SafeAreaView style={[styles.container_ios]}>
        <View style={{height: 52}} />
        <View style={styles.titleBox}>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText}>이용 약관에</Text>
            <Text style={styles.titleText}>동의가 필요해요</Text>
          </View>
        </View>

        <View style={styles.contentWrap}>
          <View style={styles.policyItem}>
            <TouchableOpacity onPress={handleAllAgreed}>
              <Image
                source={allAgreed ? checkboxChecked : checkboxUnchecked}
                style={styles.checkboxIcon}
              />
            </TouchableOpacity>
            <Text style={styles.policyText}>전체 동의</Text>
          </View>
          <View style={styles.policyItem}>
            <TouchableOpacity onPress={toggleTermsOfService}>
              <Image
                source={termsOfService ? checkboxChecked : checkboxUnchecked}
                style={styles.checkboxIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openTermsWebView('TERMS_OF_SERVICE')}>
              <Text style={styles.policyTextLink}>이용 약관 동의 (필수)</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.policyItem}>
            <TouchableOpacity onPress={togglePrivacy}>
              <Image
                source={privacy ? checkboxChecked : checkboxUnchecked}
                style={styles.checkboxIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openTermsWebView('PRIVACY')}>
              <Text style={styles.policyTextLink}>
                개인정보 수집 및 이용 동의 (필수)
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.policyItem}>
            <TouchableOpacity onPress={toggleMarketing}>
              <Image
                source={marketing ? checkboxChecked : checkboxUnchecked}
                style={styles.checkboxIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openTermsWebView('MARKETING')}>
              <Text style={styles.policyTextLink}>
                서비스 소식 등 마케팅 수신 동의 (선택)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <SignUpButton
          clickButtonEvent={CLICK_BUTTON_EVENT_PARAMS.SIGN_UP}
          disable={!isRequiredAgreed}
          onPress={onPressConfirm}
        />
      </SafeAreaView>

      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={closeWebView}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.webViewHeader}>
            <BackButton color="blue" onPress={closeWebView} />
          </View>
          <WebView source={{uri: webViewUrl}} style={{flex: 1}} />
        </SafeAreaView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container_ios: {height: SCREEN_HEIGHT},
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
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  policyText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
  policyTextLink: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
    textDecorationLine: 'underline',
  },
  webViewHeader: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});
