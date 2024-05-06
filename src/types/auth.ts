type ProviderType = 'KAKAO' | 'APPLE';

export interface UserInfo {
  nickname: string;
  safeNickname: string;
  personalityIds: number[];
  topicIds: number[];
  geolocationId: number;
  parentGeolocationId: number;
  stampQuantity: number;
}

export interface ProviderToken {
  idToken: string;
  providerType: ProviderType;
}

export interface AuthTokens {
  registerToken: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  verified: boolean;
}

export interface RegisterInfo {
  registerToken: string;
  nickname: string;
  personalityIds: number[];
  topicIds: number[];
  geolocationId: number;
}

export interface PatchUserInfoRequest {
  nickname?: string;
  geolocationId?: number;
  topicIds?: number[];
  personalityIds?: number[];
}
