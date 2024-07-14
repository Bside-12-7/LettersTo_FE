export interface Selector {
  start: number;
  end: number;
}

export type ProviderType = 'KAKAO' | 'APPLE';
export interface Token {
  idToken: string;
  providerType: ProviderType;
}

export interface RegisterToken {
  registerToken: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  verified: boolean;
}

export type Topic = {
  group: 'ENTERTAINMENT' | 'LIFE_HOBBY' | 'KNOWLEDGE_ETC';
  id: number;
  name: string;
};

export type Topics = Topic[];

export type Personality = {
  id: number;
  name: string;
};

export type Personalities = Personality[];

export type Region = {
  id: number;
  name: string;
};

export type Regions = Region[];

export type Cities = {
  id: number;
  name: string;
}[];

export interface UserInfo {
  registerToken: string;
  nickname: string;
  topicIds: number[];
  personalityIds: number[];
  stampQuantity: number;
  geolocationId: number;
}

export type TexticonCategory =
  | 'happy'
  | 'worry'
  | 'angry'
  | 'upfeeling'
  | 'wink'
  | 'sad'
  | 'love';

export type Texticons = {
  [key in TexticonCategory]: {
    key: string;
    list: string[];
  };
};

export type Stamp = {
  id: number;
  fileId: string;
};

export type Stamps = Stamp[];

export type PaperColor =
  | 'PINK'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'MINT'
  | 'SKY_BLUE'
  | 'BLUE'
  | 'PURPLE'
  | 'LAVENDER';

export type PaperStyle = 'GRID' | 'DOT' | 'PLAIN';

export type AlignType = 'LEFT' | 'CENTER' | 'RIGHT';

export type PublicLetterWriteRequest = {
  title: string;
  content: string;
  paperType: PaperStyle;
  paperColor: PaperColor;
  stampId: number;
  alignType: AlignType;
  topics: number[];
  personalities: number[];
  files?: string[];
};

export interface PublicLetter {
  id: number;
  title: string;
  fromAddress: string;
  fromNickname: string;
  topics: string[];
  personalities: string[];
  paperColor: PaperColor;
  stampId: number;
  alignType: AlignType;
  createDate?: Date;
  [key: string]: any;
}

export type PublicLetters = PublicLetter[];

export interface PublicLetterContent {
  id: number;
  title: string;
  content: string;
  fromAddress: string;
  fromNickname: string;
  paperColor: PaperColor;
  paperType: PaperStyle | 'LINE';
  alignType: AlignType;
  stampId: number;
  replied: boolean;
  canReply: boolean;
  files: string[];
  createdDate: Date;
}

export interface DeliveryLetterContent {
  id: number;
  title: string;
  content: string;
  fromAddress: string;
  fromNickname: string;
  paperColor: PaperColor;
  paperType: PaperStyle | 'LINE';
  alignType: AlignType;
  stampId: number;
  replied: boolean;
  canReply: boolean;
  files: string[];
  createdDate: Date;
}

export interface DeliveryLetterWriteRequest {
  id?: number;
  title?: string;
  content?: string;
  paperType?: PaperStyle;
  paperColor?: PaperColor;
  alignType?: AlignType;
  stampId?: number;
  files?: string[];
  deliveryType?: 'NONE' | 'STANDARD' | 'EXPRESS';
}

export interface DeliveryLetterWriteRequestV2 {
  letterId?: number;
  letterBoxType: 'ANONYMOUS_DIRECT_MESSAGE' | 'DIRECT_MESSAGE';
  opponentMemberId: number;
  title: string;
  content: string;
  paperType: PaperStyle;
  paperColor: PaperColor;
  alignType: AlignType;
  stampId: number;
  files: string[];
  deliveryType: 'NONE' | 'STANDARD' | 'EXPRESS';
}

export interface LetterBox {
  id: number;
  type: 'ANONYMOUS_DIRECT_MESSAGE' | 'DIRECT_MESSAGE';
  fromMemberId: number;
  fromMemberNickname: string;
  new: boolean;
}

export type LetterBoxes = LetterBox[];

export interface LetterBoxInfo {
  fromNickname: string;
  fromAddress: string;
  startDate: Date;
  topics: string[];
  personalities: string[];
  [key: string]: any;
}

export interface DeliveryLetter {
  id: number;
  title: string;
  fromAddress: string;
  fromNickname: string;
  toAddress: string;
  toNickname: string;
  paperColor: PaperColor;
  stampId: number;
  read: boolean;
  me: boolean;
  deliveryType: 'NONE' | 'STANDARD' | 'EXPRESS';
  deliveryDate: Date;
  [key: string]: any;
}

export type DeliveryLetters = DeliveryLetter[];

export interface ReportData {
  letterId: number;
  description: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'STAMP' | 'LETTER';
  intent: string;
  read: boolean;
  createdDate: Date;
}

export interface Feedback {
  id: -1;
  type: 'FEEDBACK';
}

export type NotificationList = Notification[];

export interface StampHistory {
  id: number;
  type: 'REGISTRATION' | 'DAILY' | 'REVIEW';
  description: string;
  quantity: number;
  createdDate: Date;
}

export type StampHistories = StampHistory[];

export type DeliveryType = 'STANDARD' | 'EXPRESS';

export interface DeliveryDate {
  deliveryDate: Date;
  deliveryType: DeliveryType;
}

export interface InvitationCode {
  invitationCode: string;
  expirationDate: string;
  expired: boolean;
}

export interface Friend {
  id: number;
  memberId: number;
  nickname: string;
}
