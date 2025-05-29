
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Users, 
  MessageSquare,
  Share,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface MeetingRoomProps {
  roomId: string;
  isTeacher?: boolean;
}

export const MeetingRoom = ({ roomId, isTeacher = false }: MeetingRoomProps) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Initialize camera and microphone
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsConnected(true);
        toast.success('Connexion établie');
      } catch (error) {
        console.error('Erreur d\'accès aux médias:', error);
        toast.error('Impossible d\'accéder à la caméra/micro');
      }
    };

    initializeMedia();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsConnected(false);
    toast.success('Appel terminé');
    window.close();
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      
      toast.success('Partage d\'écran activé');
    } catch (error) {
      console.error('Erreur de partage d\'écran:', error);
      toast.error('Impossible de partager l\'écran');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Session Live</h1>
            <p className="text-gray-400">Salle: {roomId}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{participants.length + 1} participant(s)</span>
          </div>
        </div>

        {/* Video Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Main Video */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                      <VideoOff className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                    {isTeacher ? 'Professeur' : 'Vous'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {participants.length === 0 ? (
                  <p className="text-gray-400 text-sm">En attente d'étudiants...</p>
                ) : (
                  participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">
                        {participant.charAt(0)}
                      </div>
                      <span className="text-sm">{participant}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleAudio}
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button
            onClick={toggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          {isTeacher && (
            <Button
              onClick={shareScreen}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <Share className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            onClick={endCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Bar */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
