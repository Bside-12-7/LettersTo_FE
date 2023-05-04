import {axiosInstance} from '@utils/http';

export async function sendAttendance() {
  return await axiosInstance.post<null>('/attendances');
}
