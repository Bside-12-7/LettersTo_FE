import {axiosInstance} from '@utils/http';

export interface AppCheckForcedUpdateCommand {
  platform: 'IOS' | 'ANDROID';
  currentVersion: string;
  currentBuildNumber: number;
}

export interface AppCheckForcedUpdateResult {
  shouldForceUpdate: boolean;
}

export async function checkForcedUpdate(
  command: AppCheckForcedUpdateCommand,
) {
  return await axiosInstance.get<AppCheckForcedUpdateResult>(
    '/app-version/check-forced-update',
    {
      params: command,
    },
  );
}
