
export type PrivateMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type Conversation = {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  last_message: string;
  last_message_date: string;
  unread_count: number;
};
