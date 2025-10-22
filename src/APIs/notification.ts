import {axiosInstance} from '@utils/http';

interface NotificationsRequestParams {
  read?: boolean;
  cursor?: number;
}

interface NotificationsResponse {
  content: any[];
  cursor: number;
}

export interface NotificationPreferenceRequest {
  receptionType: 'SERVICE' | 'MARKETING';
  enabled: boolean;
}

export const getNotifications = async (data: NotificationsRequestParams) => {
  return await axiosInstance.get<NotificationsResponse>('/notifications', {
    params: data,
  });
};

export const setNotificationRead = async (id: number) => {
  return await axiosInstance.post(`/notifications/${id}/read`);
};

export const getNotificationPreference = async () => {
  return await axiosInstance.get<{SERVICE: boolean; MARKETING: boolean}>(
    '/notification-preference',
  );
};

export const setNotificationPreference = async (request: {
  receptionType: 'SERVICE' | 'MARKETING';
  enabled: boolean;
}) => {
  return await axiosInstance.post('/notification-preference', request);
};
