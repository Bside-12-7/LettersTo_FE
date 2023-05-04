import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TopicEditor} from '@components/LetterEditor/CoverEditor/TopicEditor';
import {LetterCoverPreview} from '@components/LetterEditor/CoverPreview/LetterCoverPreview';
import useStore from '@stores/store';
import {StepIndicator} from '@components/StepIndicator';
import {PUBLIC_COVER_EDIT_STEPS} from '@constants/user';
import {Header2} from '@components/Headers/Header2';
import {useTopic} from '@hooks/UserInfo/useTopic';
import {useQuery} from 'react-query';
import Toast from '@components/Toast/toast';
import {getUserInfo} from '@apis/member';
import {getCities, getRegions} from '@apis/geolocation';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'CoverTopicEditor'>;

export function CoverTopicEditor({navigation}: Props) {
  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  const {
    setCoverTopicIds,
    setCoverPersonalityIds,
    setCoverAddress,
    setCoverNickname,
  } = useStore();

  const goNext = () =>
    !disableNext && navigation.navigate('CoverPersonalityEditor');

  const goBack = () => {
    navigation.pop();
  };

  const {
    topics,
    selectedTopicIds,
    selectTopic,
    counter,
    reset,
    initUserTopicIds,
  } = useTopic();

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);

  const disableNext = useMemo(
    () => selectedTopicIds.length === 0,
    [selectedTopicIds],
  );

  useEffect(() => {
    setCoverTopicIds(selectedTopicIds);
  }, [selectedTopicIds, setCoverTopicIds]);

  useEffect(() => {
    if (userInfo) {
      setCoverPersonalityIds(userInfo.personalityIds);
      initUserTopicIds(userInfo.topicIds);
    }
  }, [initUserTopicIds, setCoverPersonalityIds, userInfo]);

  useEffect(() => {
    const getFromAddress = async (
      parentGeolocationId: number,
      geolocationId: number,
    ) => {
      const userRegion = (await getRegions()).find(
        (region: any) => region.id === geolocationId,
      );
      const userCity = (await getCities(geolocationId)).find(
        (city: any) => city.id === parentGeolocationId,
      );

      setCoverAddress(userRegion?.name || '', userCity?.name || '');
    };

    if (userInfo) {
      setCoverNickname(userInfo.nickname);
      try {
        getFromAddress(userInfo.geolocationId, userInfo.parentGeolocationId);
      } catch (error: any) {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      }
    }
  }, [setCoverAddress, setCoverNickname, userInfo]);

  if (!isSuccess) {
    return <></>;
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={[
          styles.coverContainer,
          {
            height: 332 + SAFE_AREA_TOP,
            paddingTop: SAFE_AREA_TOP,
          },
        ]}>
        <Header2
          title={'관심사 선택'}
          onPressNext={goNext}
          onPressBack={goBack}
          disableNext={disableNext}
        />
        <View style={styles.cover}>
          <LetterCoverPreview />
        </View>
        <StepIndicator
          current={PUBLIC_COVER_EDIT_STEPS.TOPIC}
          of={PUBLIC_COVER_EDIT_STEPS.total}
        />
      </View>
      <TopicEditor
        topics={topics}
        selectedTopicIds={selectedTopicIds}
        selectTopic={selectTopic}
        counter={counter}
        reset={reset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    backgroundColor: '#ffccee',
  },
  cover: {paddingTop: 12, paddingHorizontal: 40},
});
