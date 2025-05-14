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
import {SCREEN_NAMES} from '@constants/navigation';

const Stack = createNativeStackNavigator<StackParamsList>();

export default function StackNavigator() {
  const {isLoggedIn, isLoading} = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
    isLoading: state.isLoading,
  }));

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={SCREEN_NAMES.SPLASH}>
      {isLoading ? (
        <Stack.Screen name={SCREEN_NAMES.SPLASH} component={Splash} />
      ) : isLoggedIn ? (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name={SCREEN_NAMES.MAIN.MAIN} component={Main} />
          <Stack.Screen
            name={SCREEN_NAMES.LETTER_VIEWER}
            component={LetterViewer}
          />
          <Stack.Screen
            name={SCREEN_NAMES.LETTER_BOX_DETAIL}
            component={LetterBoxDetail}
          />

          {/* 회원정보 수정 */}
          <Stack.Screen name={SCREEN_NAMES.MY_PAGE} component={MyPage} />
          <Stack.Screen
            name={SCREEN_NAMES.ACCOUNT_DELETE}
            component={AccountDelete}
          />

          {/* 편지 작성 */}
          <Stack.Screen
            name={SCREEN_NAMES.LETTER_EDITOR}
            component={LetterEditor}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name={SCREEN_NAMES.COVER_DELIVERY_SELECTOR}
            component={CoverDeliverySelector}
          />
          <Stack.Screen
            name={SCREEN_NAMES.COVER_TOPIC_EDITOR}
            component={CoverTopicEditor}
          />
          <Stack.Screen
            name={SCREEN_NAMES.COVER_PERSONALITY_EDITOR}
            component={CoverPersonalityEditor}
          />
          <Stack.Screen
            name={SCREEN_NAMES.COVER_STAMP_SELECTOR}
            component={CoverStampSelector}
          />
          <Stack.Screen
            name={SCREEN_NAMES.LETTER_COMPLETE}
            component={LetterComplete}
          />

          {/* 알림 */}
          <Stack.Screen
            name={SCREEN_NAMES.NOTIFICATIONS}
            component={Notifications}
          />

          {/* 우표 */}
          <Stack.Screen
            name={SCREEN_NAMES.STAMP_HISTORY}
            component={StampHistory}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name={SCREEN_NAMES.AUTH} component={Auth} />
          <Stack.Screen
            name={SCREEN_NAMES.NICKNAME_FORM}
            component={NicknameForm}
          />
          <Stack.Screen name={SCREEN_NAMES.TOPIC_FORM} component={TopicsForm} />
          <Stack.Screen
            name={SCREEN_NAMES.PERSONALITY_FORM}
            component={PersonalityForm}
          />
          <Stack.Screen
            name={SCREEN_NAMES.LOCATION_FORM}
            component={LocationForm}
          />
          <Stack.Screen name={SCREEN_NAMES.COACHMARK} component={Coachmark} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
