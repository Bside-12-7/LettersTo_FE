import type {
  UserInfo,
  RegisterInfo,
  AuthTokens,
  PatchUserInfoRequest,
} from '@type/auth';
import {axiosInstance} from '@utils/http';

export async function signUp(registerInfo: RegisterInfo) {
  return await axiosInstance.post<AuthTokens>('/members', {...registerInfo});
}

export async function getUserInfo() {
  return await axiosInstance.get<UserInfo>('/members');
}

export async function existsNickname(nickname: string) {
  return await axiosInstance.get<boolean>('/members/nickname/exists', {
    params: {nickname},
  });
}

export async function patchUserInfo(userInfo: PatchUserInfoRequest) {
  return await axiosInstance.patch<null>('/members', userInfo);
}

export async function deleteAccount() {
  return await axiosInstance.delete<null>('/members');
}
