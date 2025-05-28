
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    message_type: 'text' | 'audio';
    audio_url?: string;
    created_at: string;
    user_id: string;
    sender?: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  currentUserId?: string;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isOwnMessage = message.user_id === currentUserId;

  const handlePlayAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={message.sender?.avatar_url || ''} />
            <AvatarFallback>
              {(message.sender?.full_name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`rounded-lg p-3 ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}>
          {!isOwnMessage && (
            <div className="text-xs font-semibold mb-1 opacity-70">
              {message.sender?.full_name || 'Utilisateur'}
            </div>
          )}
          
          {message.message_type === 'audio' ? (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlayAudio}
                className={`h-8 w-8 ${isOwnMessage ? 'text-white hover:bg-blue-600' : ''}`}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">Message vocal</span>
              {message.audio_url && (
                <audio
                  ref={audioRef}
                  src={message.audio_url}
                  onEnded={handleAudioEnd}
                  preload="metadata"
                />
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
          
          <div className={`text-xs mt-1 opacity-70 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
            {formatDistanceToNow(new Date(message.created_at), { 
              addSuffix: true,
              locale: fr 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
