import type {Topics} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function getTopics() {
  return await axiosInstance.get<Topics>('/topics');
}
