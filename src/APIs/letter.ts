import {
  DeliveryLetterWriteRequest,
  PublicLetterContent,
  PublicLetters,
  PublicLetterWriteRequest,
} from '../types/types';
import {instance, instanceWithAuth} from '../Utils/http';

type PublicLetterData = {
  content: PublicLetters | [];
  cursor: number;
};

export async function getPublicLetters(
  cursor?: number,
): Promise<PublicLetterData> {
  if (cursor) {
    return await instance.get('/public-letters', {cursor});
  } else {
    return await instance.get('/public-letters');
  }
}

export async function getPublicLetterContent(
  id: number,
): Promise<PublicLetterContent> {
  return await instanceWithAuth.get(`/public-letters/${id}`);
}

export async function postPublicLetter(
  publicLetterData: PublicLetterWriteRequest,
) {
  return await instanceWithAuth.post('/public-letters', publicLetterData);
}

export async function replyPublicLetter(
  deliveryLetterData: DeliveryLetterWriteRequest,
) {
  return await instanceWithAuth.post(
    '/public-letters/reply',
    deliveryLetterData,
  );
}

export async function postDeliveryLetter(
  deliveryLetterData: DeliveryLetterWriteRequest,
) {
  return await instanceWithAuth.post('/delivery-letters', deliveryLetterData);
}

export async function getDeliveryLetterContent(id: number) {
  return await instanceWithAuth.post(`/delivery-letters/${id}/open`);
}

export async function getDeliveryDate(id: number) {
  return await instanceWithAuth.get(`/letters/${id}/delivery-date`, {
    deliveryType: 'STANDARD',
  });
}
