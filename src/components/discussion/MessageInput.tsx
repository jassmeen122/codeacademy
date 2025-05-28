
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Square } from 'lucide-react';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'audio', audioUrl?: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleSendText = () => {
    if (!message.trim()) return;
    onSendMessage(message, 'text');
    setMessage('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage('Message vocal', 'audio', audioUrl);
        setAudioChunks([]);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            placeholder="Écrivez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            className="min-h-[60px] resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSendText}
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-12 w-12"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            className="h-12 w-12"
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {isRecording && (
        <div className="mt-2 text-red-500 text-sm animate-pulse">
          🔴 Enregistrement en cours...
        </div>
      )}
    </div>
  );
};
