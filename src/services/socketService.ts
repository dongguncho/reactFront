import { io, Socket } from 'socket.io-client';
import { 
  WebSocketMessage, 
  JoinRoomData, 
  LeaveRoomData, 
  SendMessageData, 
  EditMessageData, 
  DeleteMessageData, 
  TypingData,
  MessageEditedData,
  MessageDeletedData,
  UserJoinedData,
  UserLeftData,
  UserTypingData,
  UserStoppedTypingData,
  RoomJoinedData,
  RoomLeftData,
  ErrorData
} from '../types';

export interface TypingUser {
  userId: string;
  userName: string;
  roomId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // 웹소켓 연결
  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:8080', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket 연결됨 - Socket ID:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket 연결 해제됨');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket 연결 에러:', error);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket 에러:', error);
    });
  }

  // 웹소켓 연결 해제
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 방 참여
  joinRoom(roomId: string) {
    if (this.socket) {
      const data: JoinRoomData = { roomId };
      this.socket.emit('join_room', data);
    }
  }

  // 방 나가기
  leaveRoom(roomId: string) {
    if (this.socket) {
      const data: LeaveRoomData = { roomId };
      this.socket.emit('leave_room', data);
    }
  }

  // 메시지 전송
  sendMessage(roomId: string, content: string, type: string = 'text') {
    console.log('SocketService - 메시지 전송:', { roomId, content, type });
    console.log('SocketService - 소켓 상태:', this.socket?.connected);
    
    if (this.socket) {
      const data: SendMessageData = { roomId, content, type };
      this.socket.emit('send_message', data);
      console.log('SocketService - 메시지 emit 완료');
    } else {
      console.error('SocketService - 소켓이 연결되지 않음');
    }
  }

  // 메시지 수정
  editMessage(messageId: string, content: string) {
    if (this.socket) {
      const data: EditMessageData = { messageId, content };
      this.socket.emit('edit_message', data);
    }
  }

  // 메시지 삭제
  deleteMessage(messageId: string) {
    if (this.socket) {
      const data: DeleteMessageData = { messageId };
      this.socket.emit('delete_message', data);
    }
  }

  // 타이핑 시작
  startTyping(roomId: string) {
    if (this.socket) {
      const data: TypingData = { roomId };
      this.socket.emit('typing_start', data);
    }
  }

  // 타이핑 중단
  stopTyping(roomId: string) {
    if (this.socket) {
      const data: TypingData = { roomId };
      this.socket.emit('typing_stop', data);
    }
  }

  // 이벤트 리스너 등록
  onNewMessage(callback: (message: WebSocketMessage) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageEdited(callback: (data: MessageEditedData) => void) {
    if (this.socket) {
      this.socket.on('message_edited', callback);
    }
  }

  onMessageDeleted(callback: (data: MessageDeletedData) => void) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  onUserJoined(callback: (data: UserJoinedData) => void) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (data: UserLeftData) => void) {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onUserTyping(callback: (data: UserTypingData) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: UserStoppedTypingData) => void) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }

  onRoomJoined(callback: (data: RoomJoinedData) => void) {
    if (this.socket) {
      this.socket.on('room_joined', callback);
    }
  }

  onRoomLeft(callback: (data: RoomLeftData) => void) {
    if (this.socket) {
      this.socket.on('room_left', callback);
    }
  }

  onError(callback: (error: ErrorData) => void) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // 이벤트 리스너 제거
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // 연결 상태 확인
  isSocketConnected(): boolean {
    return this.isConnected;
  }
}

// 싱글톤 인스턴스 생성
const socketService = new SocketService();
export default socketService; 