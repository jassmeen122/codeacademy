
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Users, Calendar, Clock, Send, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useUserCalls } from '@/hooks/useUserCalls';

interface VideoCallManagerProps {
  courseId: string;
}

export const VideoCallManager = ({ courseId }: VideoCallManagerProps) => {
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [isCreating, setIsCreating] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const { initiateCall } = useUserCalls();

  const generateMeetingLink = () => {
    // Generate a unique meeting room ID
    const roomId = `course-${courseId}-${Date.now()}`;
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/meeting/${roomId}`;
    setMeetingLink(link);
    return link;
  };

  const handleCreateLiveSession = async () => {
    if (!sessionTitle.trim()) {
      toast.error('Veuillez saisir un titre pour la session');
      return;
    }

    setIsCreating(true);
    try {
      const link = generateMeetingLink();
      
      // In a real implementation, you would save this to the database
      // For now, we'll just show the link
      toast.success('Session live créée avec succès !');
      
      // TODO: Save session details to database
      // TODO: Send notifications to enrolled students
      
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      toast.error('Erreur lors de la création de la session');
    } finally {
      setIsCreating(false);
    }
  };

  const copyMeetingLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const startInstantMeeting = () => {
    const link = generateMeetingLink();
    window.open(link, '_blank');
    toast.success('Réunion instantanée démarrée');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Démarrez une session en direct ou programmez une future session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={startInstantMeeting}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Démarrer Maintenant
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Inviter des Étudiants
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Live Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Programmer une Session Live
          </CardTitle>
          <CardDescription>
            Créez une session programmée pour vos étudiants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-title">Titre de la session</Label>
            <Input
              id="session-title"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Ex: Cours de JavaScript - Variables et Fonctions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-description">Description (optionnel)</Label>
            <Textarea
              id="session-description"
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
              placeholder="Décrivez le contenu de la session..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-date">Date</Label>
              <Input
                id="session-date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session-time">Heure</Label>
              <Input
                id="session-time"
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session-duration">Durée (minutes)</Label>
              <Select value={sessionDuration} onValueChange={setSessionDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCreateLiveSession}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Créer la Session
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Meeting Link Display */}
      {meetingLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-purple-500" />
              Lien de la Réunion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <code className="flex-1 text-sm">{meetingLink}</code>
              <Button size="sm" variant="outline" onClick={copyMeetingLink}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => window.open(meetingLink, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Partagez ce lien avec vos étudiants pour qu'ils puissent rejoindre la session
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions Programmées</CardTitle>
          <CardDescription>
            Vos prochaines sessions en direct
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune session programmée</p>
            <p className="text-sm">Créez votre première session ci-dessus</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
