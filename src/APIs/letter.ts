import {
  DeliveryLetterContent,
  DeliveryLetterWriteRequest,
  DeliveryLetterWriteRequestV2,
  PublicLetterContent,
  PublicLetters,
  PublicLetterWriteRequest,
} from '@type/types';
import {axiosInstance} from '@utils/http';

type PublicLetterData = {
  content: PublicLetters | [];
  cursor: number;
};

export async function getPublicLetters(cursor?: number) {
  if (cursor) {
    return await axiosInstance.get<PublicLetterData>('/public-letters', {
      params: {cursor},
    });
  } else {
    return await axiosInstance.get<PublicLetterData>('/public-letters');
  }
}

export async function getPublicLetterContent(id: number) {
  return await axiosInstance.get<PublicLetterContent>(`/public-letters/${id}`);
}

export async function postPublicLetter(
  publicLetterData: PublicLetterWriteRequest,
) {
  return await axiosInstance.post('/public-letters', publicLetterData);
}

export async function replyPublicLetter(
  deliveryLetterData: DeliveryLetterWriteRequest,
) {
  return await axiosInstance.post('/public-letters/reply', deliveryLetterData);
}

export async function postDeliveryLetter(
  deliveryLetterData: DeliveryLetterWriteRequest,
) {
  return await axiosInstance.post('/delivery-letters', deliveryLetterData);
}

export async function postDeliveryLetterV2(
  deliveryLetterData: DeliveryLetterWriteRequestV2,
) {
  return await axiosInstance.post('/delivery-letters/v2', deliveryLetterData);
}

export async function getDeliveryLetterContent(id: number) {
  return await axiosInstance.post<DeliveryLetterContent>(
    `/delivery-letters/${id}/open`,
  );
}

export async function getDeliveryDate(id: number) {
  return await axiosInstance.get<{deliveryDate: string}>(
    `/letters/${id}/delivery-date`,
    {
      params: {
        deliveryType: 'STANDARD',
      },
    },
  );
}
