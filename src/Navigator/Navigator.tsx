import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackParamsList} from '../types';
import useStore from '../Store/store';

// Splash
import {Splash} from '../Screens/Splash';

// 메인 서비스 스크린
import {Home} from '../Screens/Main/Home';

// 인증 관련 스크린
import {Auth} from '../Screens/Auth/Auth';
import {NicknameForm} from '../Screens/SignUp/NicknameForm';
import {InterestsForm} from '../Screens/SignUp/InterestsForm';
import {PersonalityForm} from '../Screens/SignUp/PersonalityForm';
import {LocationForm} from '../Screens/SignUp/LocationForm';

// 편지 작성
import {TextEditor} from '../Screens/TextEditor/TextEditor';

const Stack = createNativeStackNavigator<StackParamsList>();

export default function StackNavigator() {
  const {isLoggedIn, isLoading} = useStore();

  return (
    <Stack.Navigator initialRouteName="Splash">
      {isLoading ? (
        <Stack.Screen name="Splash" component={Splash} />
      ) : isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen name="Home" component={Home} />

          <Stack.Screen name="TextEditor" component={TextEditor} />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="NicknameForm" component={NicknameForm} />
          <Stack.Screen name="InterestsForm" component={InterestsForm} />
          <Stack.Screen name="PersonalityForm" component={PersonalityForm} />
          <Stack.Screen name="LocationForm" component={LocationForm} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
