import {InvitationCode} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function generateInvitationCode() {
  return await axiosInstance.post('/friend-invitation-code/generate');
}

export async function getInvitationCode() {
  return await axiosInstance.get<InvitationCode>('/friend-invitation-code');
}
