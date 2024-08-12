import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
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

type Props = NativeStackScreenProps<StackParamsList, 'LetterComplete'>;

export const LetterComplete = ({navigation, route}: Props) => {
  const {cover, letter} = useStore();
  const {deliveryLetter} = useLetterEditorStore();
  const queryClient = useQueryClient();

  const sendPublicLetter = useCallback(async () => {
    if (cover.stamp && letter) {
      try {
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
        queryClient.invalidateQueries('letterBox');
        navigation.navigate('Main');
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    }
  }, [
    cover.personalityIds,
    cover.stamp,
    cover.topicIds,
    letter,
    navigation,
    queryClient,
  ]);

  const sendDeliveryLetter = useCallback(async () => {
    try {
      const letterData: DeliveryLetterWriteRequest = {
        ...deliveryLetter,
      };

      if (route.params?.to === 'PUBLIC') {
        await replyPublicLetter(letterData);
      } else if (route.params?.to === 'DELIVERY') {
        await postDeliveryLetterV2(letterData);
      }
      queryClient.invalidateQueries('letterBox');
      Toast.show('편지 작성이 완료되었습니다!');
      navigation.navigate('Main');
    } catch (error: any) {
      console.error(error.message);
      Toast.show('문제가 발생했습니다');
    }
  }, [deliveryLetter, navigation, route.params?.to, queryClient]);

  const sendLetter = useCallback(() => {
    if (route.params) {
      sendDeliveryLetter();
    } else {
      sendPublicLetter();
    }
  }, [route.params, sendDeliveryLetter, sendPublicLetter]);

  const goBack = useCallback(() => navigation.pop(), [navigation]);

  return (
    <View style={{backgroundColor: '#ffccee', flex: 1}}>
      <SafeAreaView style={styles.container}>
        <Header2 onPressBack={goBack} title={'작성완료'} />
        <View style={styles.contentContainer}>
          <Text style={styles.completeText}>Complete!</Text>
          <Text style={styles.descText}>편지 작성을 완료했어요!</Text>
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
    height: 25,
    marginBottom: 8,
  },
  cover: {paddingTop: 12},
});
