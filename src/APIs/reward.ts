import {axiosInstance} from '@utils/http';

interface RewardStatus {
  nextAttendanceDate: Date;
  nextDailyDate: Date;
  nextShareDate: Date;
  remainingDailyCount: number;
  remainingShareCount: number;
}

export async function getRewardStatus() {
  return await axiosInstance.get<RewardStatus>('/rewards');
}

export async function requestDailyReward() {
  return await axiosInstance.post('/rewards/daily');
}

export async function requestShareReward() {
  return await axiosInstance.post('/rewards/share');
}
