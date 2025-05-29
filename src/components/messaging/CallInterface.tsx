
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Video, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import { useUserCalls } from '@/hooks/useUserCalls';
import { UserCall } from '@/types/messaging';

interface CallInterfaceProps {
  call: UserCall;
  userName?: string;
  userAvatar?: string;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({ 
  call, 
  userName = 'Utilisateur', 
  userAvatar 
}) => {
  const { endCall } = useUserCalls();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (call.started_at) {
        const startTime = new Date(call.started_at).getTime();
        const now = new Date().getTime();
        setCallDuration(Math.floor((now - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [call.started_at]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    await endCall(call.id);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {call.call_type === 'video' ? (
            <Video className="h-5 w-5" />
          ) : (
            <Phone className="h-5 w-5" />
          )}
          Appel {call.call_type === 'video' ? 'vidéo' : 'audio'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Info */}
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-3">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="text-xl">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{userName}</h3>
          <p className="text-sm text-gray-500">
            {call.status === 'ongoing' ? `En cours - ${formatDuration(callDuration)}` : 'Connexion...'}
          </p>
        </div>

        {/* Video Placeholder */}
        {call.call_type === 'video' && (
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-white text-center">
              <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Vidéo en mode simulation</p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
            className={isMuted ? 'bg-red-100 border-red-300' : ''}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          {call.call_type === 'video' && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={isVideoOff ? 'bg-red-100 border-red-300' : ''}
            >
              {isVideoOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
