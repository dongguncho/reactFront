import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatRooms, createChatRoom, joinChatRoom, leaveChatRoom } from '../../api/chat';
import { ChatRoom } from '../../types';
import './ChatRoomList.css';

interface ChatRoomListProps {
  onRoomSelect: (room: ChatRoom) => void;
  selectedRoomId?: string;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ onRoomSelect, selectedRoomId }) => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const queryClient = useQueryClient();

  const { data: roomsResponse, isLoading, refetch } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
  });

  const createRoomMutation = useMutation({
    mutationFn: createChatRoom,
    onSuccess: (response) => {
      setIsCreatingRoom(false);
      setNewRoomName('');
      setNewRoomDescription('');
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      
      // 방 생성 후 해당 방을 선택
      if (response.success && response.data) {
        onRoomSelect(response.data);
      }
    },
  });

  const rooms = roomsResponse?.data || [];

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinChatRoom(roomId);
      const updatedRooms = await refetch();
      if (updatedRooms.data?.data) {
        const joinedRoom = updatedRooms.data.data.find((room: ChatRoom) => room.id === roomId);
        if (joinedRoom) {
          onRoomSelect(joinedRoom);
        }
      }
    } catch (error) {
      console.error('방 참여 실패:', error);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    try {
      await leaveChatRoom(roomId);
      refetch();
    } catch (error) {
      console.error('방 나가기 실패:', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      createRoomMutation.mutate({
        name: newRoomName,
        description: newRoomDescription,
      });
    } catch (error) {
      console.error('방 생성 실패:', error);
    }
  };

  if (isLoading) {
    return <div className="chat-room-list-loading">채팅방 목록을 불러오는 중...</div>;
  }

  return (
    <div className="chat-room-list">
      <div className="chat-room-list-header">
        <h3>채팅방 목록</h3>
        <button 
          className="create-room-btn"
          onClick={() => setIsCreatingRoom(true)}
        >
          방 만들기
        </button>
      </div>

      {isCreatingRoom && (
        <div className="create-room-form">
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="방 이름"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              required
            />
            <textarea
              placeholder="방 설명 (선택사항)"
              value={newRoomDescription}
              onChange={(e) => setNewRoomDescription(e.target.value)}
            />
            <div className="form-buttons">
              <button type="submit" disabled={createRoomMutation.isPending}>
                {createRoomMutation.isPending ? '생성 중...' : '생성'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsCreatingRoom(false)}
                disabled={createRoomMutation.isPending}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rooms-container">
        {rooms.length === 0 ? (
          <div className="no-rooms">채팅방이 없습니다.</div>
        ) : (
          rooms.map((room) => (
            <div 
              key={room.id} 
              className={`room-item ${selectedRoomId === room.id ? 'selected' : ''}`}
              onClick={() => onRoomSelect(room)}
            >
              <div className="room-info">
                <h4>{room.name}</h4>
                {room.description && <p>{room.description}</p>}
                <div className="room-meta">
                  <span>멤버: {room.memberCount || 0}</span>
                  {room.isPrivate && <span className="private-badge">비공개</span>}
                </div>
              </div>
              <div className="room-actions">
                {room.isJoined ? (
                  <button 
                    className="leave-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeaveRoom(room.id);
                    }}
                  >
                    나가기
                  </button>
                ) : (
                  <button 
                    className="join-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinRoom(room.id);
                    }}
                  >
                    참여
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatRoomList; 