import {axiosInstance} from '@utils/http';
import {ChatMessage, ChatMemberProfile} from '@type/types';

/**
 * 메시지 목록 조회 (cursor 기반)
 * - before: 과거 메시지 로드 (무한 스크롤)
 * - after: 최신 메시지 로드 (SSE 신호 후)
 * - 둘 다 없으면 최신 페이지
 */
export async function getChatMessages(
  roomId: number,
  options?: {before?: number; after?: number; size?: number},
) {
  const params: any = {};
  if (options?.before) params.before = options.before;
  if (options?.after) params.after = options.after;
  if (options?.size) params.size = options.size;

  return await axiosInstance.get<ChatMessage[]>(
    `/chat/rooms/${roomId}/messages`,
    {params},
  );
}

/**
 * 텍스트 메시지 전송
 */
export async function sendTextMessage(roomId: number, content: string) {
  return await axiosInstance.post<{
    messageId: number;
    chatRoomId: number;
    sentAt: string;
  }>(`/chat/rooms/${roomId}/messages`, {content});
}

/**
 * 사진 메시지 전송
 * @param roomId 채팅방 ID
 * @param fileIds 파일 ID 배열 (1~5개)
 */
export async function sendPictureMessage(roomId: number, fileIds: string[]) {
  return await axiosInstance.post<{
    chatRoomId: number;
    messages: Array<{messageId: number; fileId: string; sentAt: string}>;
  }>(`/chat/rooms/${roomId}/messages/pictures`, {files: fileIds});
}

/**
 * 하트비트 (30초 주기 권장)
 */
export async function sendHeartbeat(roomId: number) {
  return await axiosInstance.post(`/chat/rooms/${roomId}/heartbeat`);
}

/**
 * 채팅방 입장
 */
export async function joinChatRoom(roomId: number) {
  return await axiosInstance.post<{chatRoomId: number; new: boolean}>(
    `/chat/rooms/${roomId}/join`,
  );
}

/**
 * 채팅방 퇴장
 */
export async function leaveChatRoom(roomId: number) {
  return await axiosInstance.post(`/chat/rooms/${roomId}/leave`);
}

/**
 * 회원 프로필 조회
 */
export async function getChatMemberProfile(memberId: number) {
  return await axiosInstance.get<ChatMemberProfile>(`/members/${memberId}`);
}
