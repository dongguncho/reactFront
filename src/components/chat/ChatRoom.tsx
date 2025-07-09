import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChatMessages, joinChatRoom, leaveChatRoom } from '../../api/chat';
import { ChatRoom as ChatRoomType, ChatMessage, WebSocketMessage } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import socketService from '../../services/socketService';
import './ChatRoom.css';

interface ChatRoomProps {
  room: ChatRoomType;
  onBack: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<{userId: string, username: string}[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  // 사용자 정보 확인
  useEffect(() => {
    console.log('ChatRoom - User info:', user);
    console.log('ChatRoom - isAuthenticated:', isAuthenticated);
    console.log('ChatRoom - User ID:', user?.id);
    console.log('ChatRoom - User name:', user?.name);
    
    // localStorage에서도 확인
    const storedUser = localStorage.getItem('user');
    console.log('ChatRoom - Stored user:', storedUser ? JSON.parse(storedUser) : 'No stored user');
  }, [user, isAuthenticated]);

  // 초기 메시지 로드 (REST API 사용)
  const { data: messagesResponse, isLoading } = useQuery({
    queryKey: ['chatMessages', room.id],
    queryFn: () => getChatMessages(room.id),
  });

  // 초기 메시지 설정
  useEffect(() => {
    if (messagesResponse?.data) {
      const sortedMessages = messagesResponse.data.sort((a: ChatMessage, b: ChatMessage) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setMessages(sortedMessages);
    }
  }, [messagesResponse?.data]);

  // 웹소켓 메시지를 REST API 메시지 형식으로 변환하는 함수
  const convertWebSocketMessage = useCallback((wsMessage: WebSocketMessage): ChatMessage => {
    return {
      id: wsMessage.id,
      content: wsMessage.content,
      type: wsMessage.type,
      isEdited: wsMessage.isEdited,
      editedAt: null,
      createdAt: wsMessage.createdAt,
      user: {
        id: wsMessage.userId,
        name: wsMessage.username,
        email: '', // 웹소켓에서는 이메일 정보가 없음
        isActive: true,
        createdAt: '',
        updatedAt: ''
      },
      room: {
        id: wsMessage.roomId,
        name: room.name
      },
      isMyMessage: wsMessage.userId === user?.id
    };
  }, [room.name, user?.id]);

  // 웹소켓 연결 및 이벤트 리스너 설정
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('웹소켓 연결 시도 - Token:', token ? '존재' : '없음');
    console.log('웹소켓 연결 시도 - User:', user);
    
    if (token && user) {
      // 웹소켓 연결
      console.log('웹소켓 연결 시작...');
      socketService.connect(token);
      
      // REST API로 방 참여
      const joinRoom = async () => {
        try {
          console.log('REST API 방 참여 시도:', room.id);
          const response = await joinChatRoom(room.id);
          console.log('REST API 방 참여 응답:', response);
          
          if (response.success) {
            console.log('REST API 방 참여 성공');
            // 웹소켓으로도 방 참여
            console.log('웹소켓 방 참여 시도:', room.id);
            socketService.joinRoom(room.id);
          } else {
            console.error('REST API 방 참여 실패:', response.message);
          }
        } catch (error) {
          console.error('REST API 방 참여 중 오류:', error);
        }
      };
      
      joinRoom();

      // 이벤트 리스너 등록
      socketService.onNewMessage((wsMessage) => {
        console.log('새 메시지 수신 (WebSocket):', wsMessage);
        console.log('현재 사용자:', user);
        
        // 웹소켓 메시지를 REST API 메시지 형식으로 변환
        const convertedMessage = convertWebSocketMessage(wsMessage);
        console.log('변환된 메시지:', convertedMessage);
        
        setMessages(prev => {
          const newMessages = [...prev, convertedMessage];
          return newMessages.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
        });
      });

      socketService.onMessageEdited((data) => {
        console.log('메시지 수정됨:', data);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.id 
              ? { ...msg, content: data.content, isEdited: true, editedAt: data.editedAt }
              : msg
          )
        );
      });

      socketService.onMessageDeleted((data) => {
        console.log('메시지 삭제됨:', data);
        setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
      });

      socketService.onUserJoined((data) => {
        console.log('사용자 참여:', data);
        // 필요시 알림 표시
      });

      socketService.onUserLeft((data) => {
        console.log('사용자 나감:', data);
        // 필요시 알림 표시
      });

      socketService.onUserTyping((data) => {
        console.log('사용자 타이핑:', data);
        setTypingUsers(prev => {
          if (!prev.find(user => user.userId === data.userId)) {
            return [...prev, { userId: data.userId, username: data.username }];
          }
          return prev;
        });
      });

      socketService.onUserStoppedTyping((data) => {
        console.log('사용자 타이핑 중단:', data);
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      });

      socketService.onRoomJoined((data) => {
        console.log('방 참여 성공:', data);
      });

      socketService.onRoomLeft((data) => {
        console.log('방 나가기 성공:', data);
      });

      socketService.onError((error) => {
        console.error('웹소켓 에러:', error);
      });
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      // REST API로 방 나가기
      const leaveRoom = async () => {
        try {
          console.log('REST API 방 나가기 시도:', room.id);
          const response = await leaveChatRoom(room.id);
          console.log('REST API 방 나가기 응답:', response);
        } catch (error) {
          console.error('REST API 방 나가기 중 오류:', error);
        }
      };
      
      leaveRoom();
      
      // 웹소켓으로도 방 나가기
      socketService.leaveRoom(room.id);
      socketService.off('new_message');
      socketService.off('message_edited');
      socketService.off('message_deleted');
      socketService.off('user_joined');
      socketService.off('user_left');
      socketService.off('user_typing');
      socketService.off('user_stopped_typing');
      socketService.off('room_joined');
      socketService.off('room_left');
      socketService.off('error');
    };
  }, [room.id, user, convertWebSocketMessage]);

  // 메시지 데이터 디버깅
  useEffect(() => {
    if (messages.length > 0) {
      console.log('Messages data:', messages);
      console.log('First message:', messages[0]);
      console.log('Last message:', messages[messages.length - 1]);
      console.log('Message count:', messages.length);
      console.log('Current user ID:', user?.id);
      console.log('Current user:', user);
      
      // 각 메시지의 사용자 정보 확인
      messages.forEach((message, index) => {
        console.log(`Message ${index}:`, {
          id: message.id,
          userId: message.user?.id,
          userName: message.user?.name,
          content: message.content,
          currentUserId: user?.id,
          isMyMessage: message.isMyMessage,
          comparison: `${message.user?.id} === ${user?.id} = ${message.user?.id === user?.id}`
        });
      });
      
      // 메시지가 로드되면 스크롤을 맨 아래로 이동
      scrollToBottom();
    }
  }, [messages, user]);

  // 채팅방에 처음 들어올 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, []);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messages.length > 0) {
      // 약간의 지연을 두어 DOM 업데이트 후 스크롤
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isSending) return;

    setIsSending(true);
    const messageContent = newMessage.trim();
    setNewMessage(''); // 입력 필드를 먼저 초기화

    try {
      console.log('메시지 전송 시도 (WebSocket):', { roomId: room.id, content: messageContent });
      
      // 웹소켓으로 메시지 전송
      socketService.sendMessage(room.id, messageContent, 'text');
      console.log('메시지 전송 완료 (WebSocket)');
      
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      // 오류 시 입력 필드 복원
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessageId || !editContent.trim()) return;

    try {
      // 웹소켓으로 메시지 수정
      socketService.editMessage(editingMessageId, editContent);
      setEditingMessageId(null);
      setEditContent('');
    } catch (error) {
      console.error('메시지 수정 실패:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('메시지를 삭제하시겠습니까?')) {
      try {
        // 웹소켓으로 메시지 삭제
        socketService.deleteMessage(messageId);
      } catch (error) {
        console.error('메시지 삭제 실패:', error);
      }
    }
  };

  // 타이핑 상태 관리
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      socketService.startTyping(room.id);
    } else {
      socketService.stopTyping(room.id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (isLoading) {
    return <div className="chat-room-loading">메시지를 불러오는 중...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <button className="back-btn" onClick={onBack}>
          ← 뒤로
        </button>
        <div className="room-info">
          <h3>{room.name}</h3>
          {room.description && <p>{room.description}</p>}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">메시지가 없습니다.</div>
        ) : (
          messages.map((message, index) => {
            const messageDate = new Date(message.createdAt).toDateString();
            const prevMessageDate = index > 0 
              ? new Date(messages[index - 1].createdAt).toDateString() 
              : null;
            
            return (
              <React.Fragment key={message.id}>
                {/* 날짜 구분선 */}
                {messageDate !== prevMessageDate && (
                  <div className="date-divider">
                    <span>{new Date(message.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                  </div>
                )}
                
                <div 
                  className={`message ${(message.user?.id && user?.id && message.user.id === user.id) ? 'own-message' : ''}`}
                >
                  {editingMessageId === message.id ? (
                    <form onSubmit={handleUpdateMessage} className="edit-form">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                      />
                      <button type="submit">저장</button>
                      <button 
                        type="button" 
                        onClick={() => setEditingMessageId(null)}
                      >
                        취소
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="message-header">
                        <span className="sender-name">
                          {message.user?.name || 
                           (message.user?.id && user?.id && message.user.id === user.id ? (user?.name || '나') : '알 수 없음')}
                        </span>
                        <span className="message-time">{formatTime(message.createdAt)}</span>
                        {message.isEdited && <span className="edited-badge">수정됨</span>}
                      </div>
                      <div className="message-content">{message.content}</div>
                      {(message.user?.id && user?.id && message.user.id === user.id) && (
                        <div className="message-actions">
                          <button 
                            onClick={() => handleEditMessage(message)}
                            className="edit-btn"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(message.id)}
                            className="delete-btn"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
        
        {/* 타이핑 상태 표시 */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span>{typingUsers.map(user => user.username).join(', ')}님이 타이핑 중...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="메시지를 입력하세요..."
          disabled={false}
        />
        <button type="submit" disabled={!newMessage.trim() || isSending}>
          {isSending ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoom; 