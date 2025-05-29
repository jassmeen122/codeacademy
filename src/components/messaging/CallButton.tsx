
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneOff } from 'lucide-react';
import { useUserCalls } from '@/hooks/useUserCalls';
import { toast } from 'sonner';

interface CallButtonProps {
  receiverId: string;
  receiverName: string;
  variant?: 'audio' | 'video';
  size?: 'sm' | 'md' | 'lg';
}

export const CallButton: React.FC<CallButtonProps> = ({ 
  receiverId, 
  receiverName, 
  variant = 'audio',
  size = 'md' 
}) => {
  const { currentCall, initiateCall, endCall, loading } = useUserCalls();

  const handleCall = async () => {
    if (currentCall) {
      await endCall(currentCall.id);
      toast.success('Appel terminé');
    } else {
      const call = await initiateCall(receiverId, variant);
      if (call) {
        toast.success(`Appel ${variant} initié avec ${receiverName}`);
      }
    }
  };

  const isInCall = currentCall && (currentCall.receiver_id === receiverId || currentCall.caller_id === receiverId);

  return (
    <Button
      onClick={handleCall}
      disabled={loading}
      variant={isInCall ? "destructive" : "outline"}
      size={size}
      className="flex items-center gap-2"
    >
      {isInCall ? (
        <>
          <PhoneOff className="h-4 w-4" />
          Terminer
        </>
      ) : (
        <>
          {variant === 'audio' ? (
            <Phone className="h-4 w-4" />
          ) : (
            <Video className="h-4 w-4" />
          )}
          {variant === 'audio' ? 'Appeler' : 'Vidéo'}
        </>
      )}
    </Button>
  );
};
