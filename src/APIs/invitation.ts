import {Friend, InvitationCode} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function generateInvitationCode() {
  return await axiosInstance.post('/friend-invitation-code/generate');
}

export async function getInvitationCode(invitationCode?: string) {
  return await axiosInstance.get<InvitationCode>('/friend-invitation-code', {
    params: {invitationCode},
  });
}

export async function applyInvitationCode(invitationCode: string) {
  return await axiosInstance.post<InvitationCode>(
    `/friend/apply-invitation-code?invitationCode=${invitationCode}`,
  );
}

export async function getFriends() {
  return await axiosInstance.get<Friend[]>('/friend');
}

export async function deleteFriends(id: number) {
  return await axiosInstance.delete<null>(`/friend/${id}`);
}
