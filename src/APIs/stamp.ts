import {StampHistories} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function getStampHistories() {
  return await axiosInstance.get<StampHistories>('/stamp-histories');
}
