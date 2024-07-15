import type {LetterBoxes, LetterBoxInfo, DeliveryLetters} from '@type/types';
import {axiosInstance} from '@utils/http';

type DeliveryLetterData = {
  content: DeliveryLetters | [];
  cursor: number;
};

export async function getLetterBoxes() {
  return await axiosInstance.get<LetterBoxes>('/letter-boxes');
}

export async function deleteLetterBox(id: number) {
  return await axiosInstance.delete<null>(`letter-boxes/${id}`);
}

export async function getLetterBoxInfo(id: number) {
  return await axiosInstance.get<LetterBoxInfo>(`/letter-boxes/${id}`);
}

export async function getDeliveryLetters(data: {
  cursor?: number;
  fromMemberId: number;
}): Promise<DeliveryLetterData> {
  return await axiosInstance.get<DeliveryLetterData>('/delivery-letters', {
    params: data,
  });
}

export async function getDeliveryLettersV2(data: {
  cursor?: number;
  letterBoxId: number;
}): Promise<DeliveryLetterData> {
  return await axiosInstance.get<DeliveryLetterData>('/delivery-letters/v2', {
    params: data,
  });
}
