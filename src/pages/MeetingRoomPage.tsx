
import React from 'react';
import { useParams } from 'react-router-dom';
import { MeetingRoom } from '@/components/teacher/MeetingRoom';
import { useAuthState } from '@/hooks/useAuthState';

const MeetingRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthState();
  
  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salle de réunion introuvable</h1>
          <p className="text-gray-400">L'ID de la salle n'est pas valide.</p>
        </div>
      </div>
    );
  }

  return (
    <MeetingRoom 
      roomId={roomId} 
      isTeacher={user?.role === 'teacher' || user?.role === 'admin'} 
    />
  );
};

export default MeetingRoomPage;
