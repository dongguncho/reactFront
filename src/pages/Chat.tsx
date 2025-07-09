import React, { useState, useEffect } from 'react';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatRoom from '../components/chat/ChatRoom';
import { ChatRoom as ChatRoomType } from '../types';
import { useAuth } from '../hooks/useAuth';
import './Chat.css';

const Chat: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);
  const { user, isAuthenticated } = useAuth();

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('Chat page - isAuthenticated:', isAuthenticated);
    console.log('Chat page - user:', user);
    console.log('Chat page - localStorage token:', localStorage.getItem('access_token') ? 'exists' : 'not found');
  }, [isAuthenticated, user]);

  const handleRoomSelect = (room: ChatRoomType) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="chat-page">
      {selectedRoom ? (
        <ChatRoom room={selectedRoom} onBack={handleBack} />
      ) : (
        <ChatRoomList onRoomSelect={handleRoomSelect} />
      )}
    </div>
  );
};

export default Chat; 