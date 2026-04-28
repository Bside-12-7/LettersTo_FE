import {ChatRooms} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function getChatRooms() {
  return await axiosInstance.get<ChatRooms>('/chat/rooms');
}
