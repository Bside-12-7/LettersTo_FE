import {axiosInstance} from '@utils/http';

interface RegisterPushTokenRequestParams {
  type: 'APNS' | 'FCM';
  token: string;
  deviceId: string;
}

export const registerPushNotificationToken = async (
  data: RegisterPushTokenRequestParams,
) => {
  return await axiosInstance.post<{deviceId: string}>('/push/register', data);
};
