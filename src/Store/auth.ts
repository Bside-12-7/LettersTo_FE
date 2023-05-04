import create from 'zustand';
import {sendAttendance} from '../APIs/attendances';
import {getUserInfo, signUp} from '../APIs/member';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegisterInfo, UserInfo} from '@type/auth';

interface AuthStore {
  isLoggedIn: boolean;
  isLoading: boolean;

  userInfo: UserInfo;

  registerInfo: RegisterInfo;

  action: {
    loginWithExistTokens: () => void;
    initRegisterInfo: (registerToken: string) => void;
    setNicknameInRegisterInfo: (nickname: string) => void;
    setTopicIdsInRegisterInfo: (topicIds: number[]) => void;
    setPersonalityIdsInRegisterInfo: (personalityIds: number[]) => void;
    setGeolocationIdInRegisterInfo: (geolocationId: number) => void;
    signup: () => void;
    setUserInfo: (userInfo: UserInfo) => void;
    login: () => void;
    logout: () => void;
    startLoading: () => void;
    endLoading: () => void;
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,

  userInfo: {
    nickname: '',
    personalityIds: [],
    topicIds: [],
    geolocationId: 0,
    parentGeolocationId: 0,
    stampQuantity: 0,
  },

  registerInfo: {
    registerToken: '',
    nickname: '',
    geolocationId: 0,
    topicIds: [],
    personalityIds: [],
  },

  action: {
    loginWithExistTokens: async () => {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('refreshToken'),
        ]);

        if (!accessToken || !refreshToken) {
          throw new Error('저장된 토큰이 없습니다.');
        }

        console.log(
          'Login With \nAccessToken:',
          accessToken,
          '\nRefreshToken: ',
          refreshToken,
        );

        const userInfo = await getUserInfo();

        set(() => ({
          isLoggedIn: true,
          userInfo: {...userInfo},
        }));

        sendAttendance();
      } catch (error: any) {
        console.error(error.message);
      } finally {
        set(() => ({isLoading: false}));
      }
    },
    setUserInfo: (userInfo: UserInfo) =>
      set(() => ({
        isLoggedIn: true,
        userInfo: {...userInfo},
      })),
    login: () => set(() => ({isLoggedIn: true})),
    logout: () => set(() => ({isLoggedIn: false})),
    startLoading: () => set(() => ({isLoading: true})),
    endLoading: () => set(() => ({isLoading: false})),
    initRegisterInfo: registerToken =>
      set(() => ({
        registerInfo: {
          registerToken,
          nickname: '',
          geolocationId: 0,
          topicIds: [],
          personalityIds: [],
        },
      })),
    setNicknameInRegisterInfo: nickname =>
      set(state => ({
        registerInfo: {...state.registerInfo, nickname},
      })),
    setTopicIdsInRegisterInfo: topicIds =>
      set(state => ({
        registerInfo: {...state.registerInfo, topicIds},
      })),
    setPersonalityIdsInRegisterInfo: personalityIds =>
      set(state => ({
        registerInfo: {...state.registerInfo, personalityIds},
      })),
    setGeolocationIdInRegisterInfo: geolocationId =>
      set(state => ({
        registerInfo: {...state.registerInfo, geolocationId},
      })),
    signup: async () => {
      const {registerInfo} = get();
      if (
        !registerInfo.nickname ||
        !registerInfo.topicIds.length ||
        !registerInfo.personalityIds.length ||
        !registerInfo.geolocationId
      ) {
        throw new Error('회원가입 정보 유실');
      }
      const {accessToken, refreshToken} = await signUp(registerInfo);
      if (!accessToken || !refreshToken) {
        throw new Error('회원가입 실패');
      }
      await Promise.all([
        AsyncStorage.setItem('accessToken', accessToken),
        AsyncStorage.setItem('refreshToken', refreshToken),
      ]);
      set(() => ({isLoading: true}));
    },
  },
}));

export const useAuthAction = () => useAuthStore(state => state.action);
