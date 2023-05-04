import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useQueryClient} from 'react-query';
import {getUserInfo} from '@apis/member';
import {BottomTab} from '@components/BottomTab/BottomTab';
import {LetterBoxList} from '../LetterBox/LetterBoxList';
import {Home} from './HomeScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';

type Props = NativeStackScreenProps<StackParamsList, 'Main'>;

export const Main = ({navigation}: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<'Home' | 'LetterBox'>(
    'Home',
  );

  const goToHome = useCallback(() => {
    setSelectedScreen('Home');
  }, []);

  const goToLetterBox = useCallback(() => {
    setSelectedScreen('LetterBox');
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUserInfo = async () => {
      await queryClient.prefetchQuery('userInfo', getUserInfo);
    };

    fetchUserInfo();
  }, [queryClient]);

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
