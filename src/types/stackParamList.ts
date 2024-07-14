import {LetterBoxType} from './types';

export interface StackParamsList {
  [keys: string]: any;

  // Splash
  Splash: undefined;

  // 메인 서비스 스택
  Main: undefined;

  // 편지 관련 스택
  LetterViewer:
    | {id: number; to: 'PUBLIC'}
    | {
        id: number;
        to: 'DELIVERY';
        type: LetterBoxType;
        fromMemberId: number;
      };
  LetterBoxList: undefined;
  LetterBoxDetail: {
    id: number;
    fromMemberId: number;
    color?: string;
    type: LetterBoxType;
  };

  // 인증 관련 스택
  Auth: undefined;

  // 회원가입 스택
  NicknameForm: undefined;
  TopicsForm: undefined;
  PersonalityForm: undefined;
  LocationForm: undefined;

  Coachmark: undefined;

  // 회원 정보 수정 스택
  MyPage: undefined;
  AccountDelete: undefined;
  AddressManage: {code: string} | undefined;

  // 편지 작성
  LetterEditor:
    | {
        reply: number;
        to: 'PUBLIC' | 'DELIVERY';
        type: LetterBoxType;
        fromMemberId?: number;
      }
    | undefined;
  CoverDeliverySelector: {reply: number; to: 'PUBLIC' | 'DELIVERY'};
  CoverTopicEditor: {reply: number; to: 'PUBLIC' | 'DELIVERY'} | undefined;
  CoverPersonalityEditor:
    | {reply: number; to: 'PUBLIC' | 'DELIVERY'}
    | undefined;
  CoverStampSelector: {reply: number; to: 'PUBLIC' | 'DELIVERY'} | undefined;
  LetterComplete: {reply: number; to: 'PUBLIC' | 'DELIVERY'} | undefined;

  // 알림
  Notifications: undefined;

  // 우표
  StampHistory: undefined;
}
