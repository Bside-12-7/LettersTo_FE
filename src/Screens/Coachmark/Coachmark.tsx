import React, {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamsList} from '@type/stackParamList';
import {Image, StatusBar, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StepIndicator} from '@components/StepIndicator';
import {BottomButton} from '@components/Button/Bottom/BottomButton';
import {ImageBackground} from 'react-native';
import {useAuthAction} from '@stores/auth';

type Props = NativeStackScreenProps<StackParamsList, 'Coachmark'>;

const step1Img = require('@assets/Image/coachmark/Step1.png');
const step2Img = require('@assets/Image/coachmark/Step2.png');
const step3Img = require('@assets/Image/coachmark/Step3.png');

const curvedArrowImg = require('@assets/Icon/coachmark/CurvedArrow.png');

const STEPS = [
  {
    STEP: 1,
    IMAGE: step1Img,
    TEXT: '공개된 편지 리스트에서\n답장하고 싶은 편지를 찾아보세요!',
    BUTTON_TEXT: '다음',
  },
  {
    STEP: 2,
    IMAGE: step2Img,
    TEXT: '먼저 공개 편지를 작성하고\n답장을 기다릴 수도 있어요!',
    BUTTON_TEXT: '다음',
  },
  {
    STEP: 3,
    IMAGE: step3Img,
    TEXT: '내 사서함 탭의 개별 사서함에서\n답장을 이어갈 수 있어요!',
    BUTTON_TEXT: 'Letters to 시작하기!',
  },
];

export const Coachmark = ({}: Props) => {
  const [currentStep, setCurrentStep] = useState(0);

  const {startLoading} = useAuthAction();

  const handlePressNext = useCallback(
    () =>
      currentStep !== 2 ? setCurrentStep(currentStep + 1) : startLoading(),
    [currentStep, startLoading],
  );

  return (
    <SafeAreaView style={{backgroundColor: '#0000cc', flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <View style={{height: 100}}>
        <StepIndicator current={STEPS[currentStep].STEP} of={3} />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <ImageBackground
          imageStyle={{
            resizeMode: 'contain',
            height: '100%',
          }}
          style={{flex: 1, aspectRatio: 223 / 450}}
          source={STEPS[currentStep].IMAGE}>
          <Image
            style={{
              position: 'absolute',
              width: 18,
              height: 58,
              right: -30,
              bottom: -30,
            }}
            source={curvedArrowImg}
          />
        </ImageBackground>
      </View>
      <View style={{marginVertical: 50, marginHorizontal: 40}}>
        <Text
          style={{
            fontFamily: 'Galmuri11',
            fontSize: 18,
            color: 'white',
            textAlign: 'center',
            lineHeight: 30,
          }}>
          {STEPS[currentStep].TEXT}
        </Text>
      </View>
      <BottomButton
        buttonText={STEPS[currentStep].BUTTON_TEXT}
        onPress={handlePressNext}
      />
    </SafeAreaView>
  );
};
