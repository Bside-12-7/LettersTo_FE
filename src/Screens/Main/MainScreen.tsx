import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {LetterBoxList} from '../LetterBox/LetterBoxList';
import {Home} from './HomeScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';
import {useAnalytics} from '@hooks/Analytics/useAnalytics';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<StackParamsList, 'Main'>;

export const Main = ({navigation}: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<'Home' | 'LetterBox'>(
    'Home',
  );

  const queryClient = useQueryClient();

  const {logScreenNameWithoutNavigation} = useAnalytics();

  const goToHome = useCallback(() => setSelectedScreen('Home'), []);

  const goToLetterBox = useCallback(() => setSelectedScreen('LetterBox'), []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      await queryClient.prefetchQuery('userInfo', getUserInfo);
    };

    fetchUserInfo();
  }, [queryClient]);

  // MainScreen은 Firebase Analytics의 Screen 항목에 [Home/LetterBox]를 따로 기록함
  useFocusEffect(
    useCallback(() => {
      logScreenNameWithoutNavigation(selectedScreen);
    }, [logScreenNameWithoutNavigation, selectedScreen]),
  );

  return (
    <View style={{flex: 1}}>
      {selectedScreen === 'Home' && <Home navigation={navigation} />}
      {selectedScreen === 'LetterBox' && (
        <LetterBoxList navigation={navigation} onPressHome={goToHome} />
      )}
      <BottomTab
        currentScreen={selectedScreen}
        onPressHome={goToHome}
        onPressLetterBox={goToLetterBox}
      />
    </View>
  );
};
