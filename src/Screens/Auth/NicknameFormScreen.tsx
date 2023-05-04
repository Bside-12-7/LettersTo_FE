import React, {useCallback} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {NextButton} from '@components/Button/Bottom/NextButton';
import {SCREEN_HEIGHT} from '@constants/screen';
import {LinearGradient} from 'expo-linear-gradient';
import {useNickname} from '@hooks/UserInfo/useNickname';
import {NicknameInput} from '@components/UserInfo/Nickname/NicknameInput';
import {NicknameAvailableAlert} from '@components/UserInfo/Alert/NicknameAvailableAlert';
import {Header2} from '@components/Headers/Header2';
import {Title} from '@components/UserInfo/TitleText';
import {useAuthAction} from '@stores/auth';

import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'NicknameForm'>;

export const NicknameForm = ({navigation}: Props) => {
  const {
    nickname,
    tempNickname,
    disable,
    alterOpacity,
    onChangeNickname,
    nicknameValidationResult,
  } = useNickname();

  const {setNicknameInRegisterInfo} = useAuthAction();

  const goToTopicForm = useCallback(() => {
    setNicknameInRegisterInfo(nickname);
    navigation.navigate('TopicsForm');
  }, [navigation, nickname, setNicknameInRegisterInfo]);

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
        <ScrollView alwaysBounceVertical={false}>
          <Header2 onPressBack={onPressBack} />
          <View style={styles.titleBox}>
            <Title title={'별명을\n입력해주세요'} />
          </View>
          <NicknameInput
            value={tempNickname}
            onChangeNickname={onChangeNickname}
          />
          <NicknameAvailableAlert
            alterOpacity={alterOpacity}
            nicknameValidation={nicknameValidationResult}
          />
        </ScrollView>
        <NextButton disable={disable} onPress={goToTopicForm} />
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
});
