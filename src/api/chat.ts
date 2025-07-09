import { apiClient } from './axios';
import { 
  ChatRoom, 
  ChatMessage, 
  CreateRoomRequest, 
  UpdateMessageRequest,
  SendMessageRequest,
  ApiResponse 
} from '../types';

// 채팅방 생성
export const createChatRoom = async (data: CreateRoomRequest): Promise<ApiResponse<ChatRoom>> => {
  const response = await apiClient.post('/chat/rooms', data);
  return response.data;
};

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ApiResponse<ChatRoom[]>> => {
  const response = await apiClient.get('/chat/rooms');
  return response.data;
};

// 방 상세 정보 조회
export const getChatRoom = async (roomId: string): Promise<ApiResponse<ChatRoom>> => {
  const response = await apiClient.get(`/chat/rooms/${roomId}`);
  return response.data;
};

// 방 참여
export const joinChatRoom = async (roomId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.post(`/chat/rooms/${roomId}/join`);
  return response.data;
};

// 방 나가기
export const leaveChatRoom = async (roomId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.post(`/chat/rooms/${roomId}/leave`);
  return response.data;
};

// 방의 메시지 조회
export const getChatMessages = async (roomId: string): Promise<ApiResponse<ChatMessage[]>> => {
  const response = await apiClient.get(`/chat/rooms/${roomId}/messages`);
  return response.data;
};

// 메시지 전송
export const sendMessage = async (roomId: string, data: SendMessageRequest): Promise<ApiResponse<ChatMessage>> => {
  const response = await apiClient.post(`/chat/rooms/${roomId}/messages`, data);
  return response.data;
};

// 메시지 수정
export const updateChatMessage = async (
  messageId: string, 
  data: UpdateMessageRequest
): Promise<ApiResponse<ChatMessage>> => {
  const response = await apiClient.put(`/chat/messages/${messageId}`, data);
  return response.data;
};

// 메시지 삭제
export const deleteChatMessage = async (messageId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/chat/messages/${messageId}`);
  return response.data;
}; 