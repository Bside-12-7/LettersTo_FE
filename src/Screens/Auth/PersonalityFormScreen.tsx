import React, {useCallback, useMemo} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SCREEN_HEIGHT} from '@constants/screen';
import {NextButton} from '@components/Button/Bottom/NextButton';
import {ResetButton} from '@components/Button/Reset/ResetButton';
import {PersonalityList} from '@components/UserInfo/Personality/PersonalityList';
import {usePersonality} from '@hooks/UserInfo/usePersonality';
import {MAX_PERSONALITY_LIMIT} from '@constants/user';
import {Header2} from '@components/Headers/Header2';
import {Title} from '@components/UserInfo/TitleText';
import {Counter} from '@components/UserInfo/CounterText';
import {MaximumAlert} from '@components/UserInfo/Alert/MaximumAlert';
import {useAuthAction} from '@stores/auth';
import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'PersonalityForm'>;

export const PersonalityForm = ({navigation}: Props) => {
  const {
    personalities,
    selectedPersonalityIds,
    selectPersonality,
    alertOpacity,
    counter,
    reset,
  } = usePersonality();

  const {setPersonalityIdsInRegisterInfo} = useAuthAction();

  const disableNext = useMemo(
    () => selectedPersonalityIds.length === 0,
    [selectedPersonalityIds],
  );

  const goToLocationForm = useCallback(() => {
    setPersonalityIdsInRegisterInfo(selectedPersonalityIds);
    navigation.navigate('LocationForm');
  }, [navigation, selectedPersonalityIds, setPersonalityIdsInRegisterInfo]);

  const onPressBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <LinearGradient colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}>
      <SafeAreaView
        style={
          Platform.OS === 'android'
            ? styles.container_android
            : styles.container_ios
        }>
        <Header2 onPressBack={onPressBack} />
        <View style={styles.titleBox}>
          <Title title={'나의 성향을\n모두 선택해주세요'} />
          <View style={styles.counterWrap}>
            <ResetButton reset={reset} />
            <Counter value={counter} max={MAX_PERSONALITY_LIMIT} />
          </View>
        </View>
        <ScrollView alwaysBounceVertical={false} style={styles.personalityBox}>
          <PersonalityList
            personalities={personalities}
            selectPersonality={selectPersonality}
            selectedPersonalityIds={selectedPersonalityIds}
          />
        </ScrollView>
        <MaximumAlert alertOpacity={alertOpacity} max={MAX_PERSONALITY_LIMIT} />
        <NextButton disable={disableNext} onPress={goToLocationForm} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container_ios: {height: SCREEN_HEIGHT},
  container_android: {height: SCREEN_HEIGHT, paddingVertical: 15},
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  counterWrap: {alignItems: 'center', flexDirection: 'row'},
  personalityBox: {
    paddingHorizontal: 24,
  },
});
