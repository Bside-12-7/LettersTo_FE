import create from 'zustand';
import {sendAttendance} from '../APIs/attendances';
import {getUserInfo, signUp} from '../APIs/member';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegisterInfo, UserInfo} from '@type/auth';

interface AuthStore {
  isLoggedIn: boolean;
  isLoading: boolean;
  termsAgreed: boolean | null;

  userInfo: UserInfo;

  registerInfo: RegisterInfo;

  action: {
    setConsentsInRegisterInfo: (
      consents: RegisterInfo['termsConsents'],
    ) => void;
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
    setTermsAgreed: (agreed: boolean) => void;
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  termsAgreed: null,

  userInfo: {
    id: 0,
    nickname: '',
    safeNickname: '',
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
    termsConsents: [],
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

        // 로그인 성공 시 약관 동의 여부 확인
        let requiredTermsAgreed = false;
        try {
          const {getMemberTermsConsent} = await import('../APIs/terms');
          const termsConsent = await getMemberTermsConsent();
          requiredTermsAgreed =
            termsConsent.TERMS_OF_SERVICE === true &&
            termsConsent.PRIVACY === true;
        } catch (termsError: any) {
          console.error('Failed to fetch terms consent:', termsError.message);
          requiredTermsAgreed = false;
        }

        // isLoggedIn과 termsAgreed를 동시에 설정
        set(() => ({
          isLoggedIn: true,
          userInfo: {...userInfo},
          termsAgreed: requiredTermsAgreed,
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
    setTermsAgreed: agreed => set(() => ({termsAgreed: agreed})),
    initRegisterInfo: registerToken =>
      set(() => ({
        registerInfo: {
          registerToken,
          nickname: '',
          geolocationId: 0,
          topicIds: [],
          personalityIds: [],
          termsConsents: [],
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
    setConsentsInRegisterInfo: termsConsents =>
      set(state => ({
        registerInfo: {...state.registerInfo, termsConsents},
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
