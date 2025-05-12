
export interface UserStatus {
  id: string;
  user_id: string;
  status: 'online' | 'offline';
  last_active: string;
}

export interface UserFriend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface UserCall {
  id: string;
  caller_id: string;
  receiver_id: string;
  call_type: 'audio' | 'video';
  status: 'ongoing' | 'missed' | 'completed';
  started_at: string;
  ended_at?: string;
  duration?: number;
}

export interface VoiceMessage {
  id: string;
  message_id: string;
  audio_url: string;
  duration: number;
  created_at: string;
}

// Type étendu pour les messages privés avec support des réponses et des messages vocaux
export interface EnhancedPrivateMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  reply_to_id: string | null;
  message_type: 'text' | 'voice';
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  reply_to_message?: EnhancedPrivateMessage | null;
  voice_message?: VoiceMessage | null;
}

// Type pour représenter un utilisateur avec son statut en ligne
export interface UserWithStatus {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  status: 'online' | 'offline';
  last_active: string;
  is_friend: boolean;
  friendship_status?: 'pending' | 'accepted' | 'rejected';
}

export interface EnhancedConversation {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  status: 'online' | 'offline';
  last_active: string;
  last_message: string;
  last_message_date: string;
  unread_count: number;
}
