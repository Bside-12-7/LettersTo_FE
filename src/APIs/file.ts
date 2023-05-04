import {axiosInstance} from '@utils/http';

type PresignUrl = {
  uploadUrl: string;
  id: string;
};

export async function getImageUploadUrl(filename: string) {
  return await axiosInstance.post<PresignUrl>(`/files?filename=${filename}`);
}
