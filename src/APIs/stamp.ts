import {StampHistories} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function getStampHistories() {
  return await axiosInstance.get<StampHistories>('/stamp-histories');
}

export async function getStamps() {
  return await axiosInstance.get<{id: number; fileId: string}[]>('/stamps');
}
