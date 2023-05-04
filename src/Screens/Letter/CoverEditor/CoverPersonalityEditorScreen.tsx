import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import type {StackParamsList} from '@type/stackParamList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PersonalityEditor} from '@components/LetterEditor/CoverEditor/PersonalityEditor';
import {LetterCoverPreview} from '@components/LetterEditor/CoverPreview/LetterCoverPreview';
import useStore from '@stores/store';
import {Header2} from '@components/Headers/Header2';
import {StepIndicator} from '@components/StepIndicator';
import {PUBLIC_COVER_EDIT_STEPS} from '@constants/user';
import {usePersonality} from '@hooks/UserInfo/usePersonality';
import {useQuery} from 'react-query';
import {getUserInfo} from '@apis/member';

type Props = NativeStackScreenProps<StackParamsList, 'CoverPersonalityEditor'>;

export function CoverPersonalityEditor({navigation}: Props) {
  const {top: SAFE_AREA_TOP} = useSafeAreaInsets();

  const {setCoverPersonalityIds} = useStore();

  const goNext = () =>
    !disableNext && navigation.navigate('CoverStampSelector');

  const goBack = () => {
    navigation.pop();
  };

  const {
    personalities,
    selectedPersonalityIds,
    selectPersonality,
    counter,
    reset,
    initUserPersonalityIds,
  } = usePersonality();

  const {data: userInfo, isSuccess} = useQuery('userInfo', getUserInfo);

  const disableNext = useMemo(
    () => selectedPersonalityIds.length === 0,
    [selectedPersonalityIds],
  );

  useEffect(() => {
    setCoverPersonalityIds(selectedPersonalityIds);
  }, [selectedPersonalityIds, setCoverPersonalityIds]);

  useEffect(() => {
    if (userInfo) {
      initUserPersonalityIds(userInfo?.personalityIds);
    }
  }, [initUserPersonalityIds, userInfo]);

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
          title={'성향 선택'}
          onPressBack={goBack}
          onPressNext={goNext}
          disableNext={disableNext}
        />
        <View style={styles.cover}>
          <LetterCoverPreview />
        </View>
        <StepIndicator
          current={PUBLIC_COVER_EDIT_STEPS.PERSONALITY}
          of={PUBLIC_COVER_EDIT_STEPS.total}
        />
      </View>
      <PersonalityEditor
        personalities={personalities}
        selectedPersonalityIds={selectedPersonalityIds}
        selectPersonality={selectPersonality}
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
