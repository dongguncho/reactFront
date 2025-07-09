// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean | { type: string; data: number[] }; // 백엔드 응답에 맞게 수정
  createdAt: string;
  updatedAt: string;
  password?: string; // 백엔드 응답에 포함됨
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// 채팅 관련 타입
export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
  participants: User[]; // 백엔드 응답에 포함됨
  admins: User[]; // 백엔드 응답에 포함됨
  messages: ChatMessage[]; // 백엔드 응답에 포함됨
  memberCount?: number;
  isJoined?: boolean;
  isAdmin?: boolean;
}

// REST API 메시지 타입
export interface ChatMessage {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  isEdited: boolean;
  editedAt?: string | null;
  createdAt: string;
  user: User;
  room: {
    id: string;
    name: string;
  };
  isMyMessage: boolean;
}

// WebSocket 메시지 타입
export interface WebSocketMessage {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  userId: string;
  username: string;
  roomId: string;
  createdAt: string;
  isEdited: boolean;
}

// WebSocket 이벤트 데이터 타입들
export interface JoinRoomData {
  roomId: string;
}

export interface LeaveRoomData {
  roomId: string;
}

export interface SendMessageData {
  roomId: string;
  content: string;
  type: string;
}

export interface EditMessageData {
  messageId: string;
  content: string;
}

export interface DeleteMessageData {
  messageId: string;
}

export interface TypingData {
  roomId: string;
}

export interface MessageEditedData {
  id: string;
  content: string;
  editedAt: string;
  roomId: string;
}

export interface MessageDeletedData {
  messageId: string;
  roomId: string;
}

export interface UserJoinedData {
  userId: string;
  username: string;
  timestamp: string;
}

export interface UserLeftData {
  userId: string;
  username: string;
  timestamp: string;
}

export interface UserTypingData {
  userId: string;
  username: string;
}

export interface UserStoppedTypingData {
  userId: string;
}

export interface RoomJoinedData {
  roomId: string;
}

export interface RoomLeftData {
  roomId: string;
}

export interface ErrorData {
  message: string;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
  maxParticipants?: number;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface SendMessageRequest {
  content: string;
  type: string;
}

export interface RoomParticipant {
  room_id: string;
  user_id: string;
  user?: User;
}

export interface RoomAdmin {
  room_id: string;
  user_id: string;
  user?: User;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// 사용자 수정 요청 타입
export interface UpdateUserRequest {
  name?: string;
  email?: string;
} 