import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {StackParamsList} from '@type/stackParamList';

// Splash
import {Splash} from '@screens/SplashScreen';

// 메인 서비스 스크린
import {Main} from '@screens/Main/MainScreen';

// 편지 관련 스크린
import {LetterViewer} from '@screens/Letter/LetterViewerScreen';
import {LetterBoxDetail} from '@screens/LetterBox/LetterBoxDetail';

// 로그인 & 회원가입 스크린
import {Auth} from '@screens/Auth/AuthScreen';
import {NicknameForm} from '@screens/Auth/NicknameFormScreen';
import {TopicsForm} from '@screens/Auth/TopicsFormScreen';
import {PersonalityForm} from '@screens/Auth/PersonalityFormScreen';
import {LocationForm} from '@screens/Auth/LocationFormScreen';
import {Coachmark} from '@screens/Coachmark/Coachmark';

// 마이 페이지 스크린
import {MyPage} from '@screens/MyPage/MyPageScreen';
import {AccountDelete} from '@screens/MyPage/AccountDeleteScreen';

// 편지 작성
import {LetterEditor} from '@screens/Letter/LetterEditorScreen';
import {CoverDeliverySelector} from '@screens/Letter/CoverEditor/CoverDeliverySelectorScreen';
import {CoverTopicEditor} from '@screens/Letter/CoverEditor/CoverTopicEditorScreen';
import {CoverPersonalityEditor} from '@screens/Letter/CoverEditor/CoverPersonalityEditorScreen';
import {CoverStampSelector} from '@screens/Letter/CoverEditor/CoverStampSelectorScreen';
import {LetterComplete} from '@screens/Letter/LetterCompleteScreen';

// 알림
import {Notifications} from '@screens/Notifications/Notifications';

// 우표
import {StampHistory} from '@screens/Stamp/StampHistory';

import {useAuthStore} from '@stores/auth';

const Stack = createNativeStackNavigator<StackParamsList>();

export default function StackNavigator() {
  const {isLoggedIn, isLoading} = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
    isLoading: state.isLoading,
  }));

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      {isLoading ? (
        <Stack.Screen name="Splash" component={Splash} />
      ) : isLoggedIn ? (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="LetterViewer" component={LetterViewer} />
          <Stack.Screen name="LetterBoxDetail" component={LetterBoxDetail} />

          {/* 회원정보 수정 */}
          <Stack.Screen name="MyPage" component={MyPage} />
          <Stack.Screen name="AccountDelete" component={AccountDelete} />

          {/* 편지 작성 */}
          <Stack.Screen name="LetterEditor" component={LetterEditor} />
          <Stack.Screen
            name="CoverDeliverySelector"
            component={CoverDeliverySelector}
          />
          <Stack.Screen name="CoverTopicEditor" component={CoverTopicEditor} />
          <Stack.Screen
            name="CoverPersonalityEditor"
            component={CoverPersonalityEditor}
          />
          <Stack.Screen
            name="CoverStampSelector"
            component={CoverStampSelector}
          />
          <Stack.Screen name="LetterComplete" component={LetterComplete} />

          {/* 알림 */}
          <Stack.Screen name="Notifications" component={Notifications} />

          {/* 우표 */}
          <Stack.Screen name="StampHistory" component={StampHistory} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="NicknameForm" component={NicknameForm} />
          <Stack.Screen name="TopicsForm" component={TopicsForm} />
          <Stack.Screen name="PersonalityForm" component={PersonalityForm} />
          <Stack.Screen name="LocationForm" component={LocationForm} />
          <Stack.Screen name="Coachmark" component={Coachmark} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
