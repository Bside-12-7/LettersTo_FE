import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  postDeliveryLetterV2,
  postPublicLetter,
  replyPublicLetter,
} from '@apis/letter';
import {Header2} from '@components/Headers/Header2';
import {DeliveryLetterCoverBackPreview} from '@components/LetterEditor/CoverPreview/DeliveryLetterCoverBackPreview';
import {DeliveryLetterCoverPreview} from '@components/LetterEditor/CoverPreview/DeliveryLetterCoverPreview';
import {LetterCoverPreview} from '@components/LetterEditor/CoverPreview/LetterCoverPreview';
import {SendLetterButton} from '@components/LetterEditor/SendLetterButton';
import {SCREEN_WIDTH} from '@constants/screen';
import useStore, {useLetterEditorStore} from '@stores/store';
import type {StackParamsList} from '@type/stackParamList';
import {
  DeliveryLetterWriteRequest,
  PublicLetterWriteRequest,
} from '@type/types';
import Toast from '@components/Toast/toast';
import {useQueryClient} from 'react-query';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {INTERSTITIAL_UNIT_ID} from '@constants/googleAds';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_UNIT_ID;

// 전면광고는 no-fill 이 상시 발생하므로(계정 상태·재고에 따라 충전율이 100%가 될 수 없다)
// 로드 실패를 정상 흐름의 일부로 보고 재시도한다.
const AD_LOAD_MAX_RETRY = 2;
const AD_LOAD_RETRY_DELAY = 1500;

type Props = NativeStackScreenProps<StackParamsList, 'LetterComplete'>;

export const LetterComplete = ({navigation, route}: Props) => {
  const {cover, letter} = useStore();
  const {deliveryLetter} = useLetterEditorStore();
  const queryClient = useQueryClient();

  // 중복 발송 가드. state 로 두면 useCallback 클로저에 갇혀 최신 값을 못 읽는다.
  const sendingRef = useRef(false);

  const {
    isLoaded,
    isClosed,
    error: adError,
    load,
    show,
  } = useInterstitialAd(adUnitId);

  const sendPublicLetter = useCallback(async () => {
    if (!cover.stamp || !letter) return;

    const letterData: PublicLetterWriteRequest = {
      title: letter.title,
      content: letter.text,
      paperType: letter.paperStyle,
      paperColor: letter.paperColor,
      alignType: letter.alignType,
      stampId: cover.stamp,
      topics: cover.topicIds,
      personalities: cover.personalityIds,
      files: letter.images,
    };

    await postPublicLetter(letterData);
    Toast.show('편지 작성이 완료되었습니다!');
    queryClient.refetchQueries('letterBox');
    queryClient.refetchQueries('userInfo');
    navigation.navigate('Main');
  }, [
    cover.personalityIds,
    cover.stamp,
    cover.topicIds,
    letter,
    navigation,
    queryClient,
  ]);

  const sendDeliveryLetter = useCallback(async () => {
    const letterData: DeliveryLetterWriteRequest = {
      ...deliveryLetter,
    };

    if (route.params?.to === 'PUBLIC') {
      await replyPublicLetter(letterData);
    } else if (route.params?.to === 'DELIVERY') {
      await postDeliveryLetterV2(letterData);
    }
    queryClient.refetchQueries('letterBox');
    queryClient.refetchQueries('userInfo');
    Toast.show('편지 작성이 완료되었습니다!');
    navigation.navigate('Main');
  }, [deliveryLetter, navigation, route.params?.to, queryClient]);

  // 발송 진입점. 광고 성공/실패 어느 경로로 들어오든 여기 하나로 모인다.
  const send = useCallback(async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;

    try {
      if (route.params) {
        await sendDeliveryLetter();
      } else {
        await sendPublicLetter();
      }
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
      // 실패했으면 다시 시도할 수 있어야 한다.
      sendingRef.current = false;
    }
  }, [route.params, sendDeliveryLetter, sendPublicLetter]);

  // 광고가 준비돼 있으면 보여주고(닫힐 때 발송), 아니면 광고 없이 바로 발송한다.
  // 광고 노출 여부가 편지 발송을 막아서는 안 된다.
  const sendLetter = useCallback(() => {
    if (isLoaded) {
      try {
        show();
        return;
      } catch (error: any) {
        // 캐시 만료 등으로 show 가 실패하면 광고를 건너뛴다.
        console.error('[Ad] show failed:', error?.message);
      }
    }
    send();
  }, [isLoaded, show, send]);

  const goBack = useCallback(() => navigation.pop(), [navigation]);

  useEffect(() => {
    load();
  }, [load]);

  // 로드 실패 시 제한 횟수만큼 재시도한다. 모두 실패하면 광고 없이 발송된다.
  const adRetryCountRef = useRef(0);
  const adRetryTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!adError) return;

    console.error('[Ad] load failed:', (adError as any).code, adError.message);

    if (adRetryCountRef.current >= AD_LOAD_MAX_RETRY) return;
    adRetryCountRef.current += 1;

    adRetryTimerRef.current = setTimeout(
      load,
      AD_LOAD_RETRY_DELAY * adRetryCountRef.current,
    );
  }, [adError, load]);

  useEffect(
    () => () => {
      if (adRetryTimerRef.current) clearTimeout(adRetryTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (isClosed) send();
  }, [isClosed, send]);

  return (
    <View style={{backgroundColor: '#ffccee', flex: 1}}>
      <SafeAreaView style={styles.container}>
        <Header2 onPressBack={goBack} title={'작성완료'} />
        <View style={styles.contentContainer}>
          <Text style={styles.completeText}>Complete!</Text>
          <Text style={styles.descText}>
            {`편지를 작성했어요.\n이제 편지를 올리기만 하면 완료!`}
          </Text>
          {!route.params ? (
            <View style={styles.cover}>
              <LetterCoverPreview />
            </View>
          ) : (
            <View
              style={[
                styles.cover,
                {height: ((SCREEN_WIDTH - 80) * 230) / 295},
              ]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SCREEN_WIDTH - 60}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={{paddingHorizontal: 40}}>
                <View style={{marginRight: 20}}>
                  <DeliveryLetterCoverPreview />
                </View>

                <DeliveryLetterCoverBackPreview />
              </ScrollView>
            </View>
          )}
        </View>

        <SendLetterButton reply={!!route.params} onPress={sendLetter} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  completeText: {
    fontFamily: 'Galmuri11-Bold',
    color: '#0000cc',
    fontSize: 18,
    marginBottom: 8,
  },
  descText: {
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  cover: {paddingTop: 12},
});
