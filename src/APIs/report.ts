import {axiosInstance} from '@utils/http';
import {ReportData} from '@type/types';

export async function reportLetter(reportData: ReportData) {
  return await axiosInstance.post('/reports', reportData);
}
