import {ChatRooms, ChatTicket, ChatTicketIssueResult} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function getChatRooms() {
  return await axiosInstance.get<ChatRooms>('/chat/rooms');
}

export async function checkChatRoomTicket(roomId: number) {
  return await axiosInstance.get<ChatTicket>(
    `/chat/rooms/${roomId}/tickets/me`,
  );
}

export async function issueChatRoomTicket(roomId: number) {
  return await axiosInstance.post<ChatTicketIssueResult>(
    `/chat/rooms/${roomId}/tickets`,
  );
}
