
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UsersList } from '@/components/messaging/UsersList';
import { EnhancedPrivateChat } from '@/components/messaging/EnhancedPrivateChat';
import { useEnhancedPrivateMessages } from '@/hooks/useEnhancedPrivateMessages';
import { useAuthState } from '@/hooks/useAuthState';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, ArrowRight, Code, Video, Phone } from 'lucide-react';

export default function TeacherPrivateMessagesPage() {
  const { user } = useAuthState();
  const { conversations, loading } = useEnhancedPrivateMessages();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');

  const handleSelectUser = (userId: string, userName: string, userAvatar?: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedUserAvatar(userAvatar || '');
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Veuillez vous connecter pour accéder aux messages privés
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Code className="h-7 w-7 text-green-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Messages Privés Professeur
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>Communication avec les étudiants</span>
            <ArrowRight className="h-4 w-4" />
            <span>Appels audio/vidéo disponibles</span>
            <Video className="h-4 w-4 text-blue-500" />
            <Phone className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Users List - Left Sidebar */}
          <div className="lg:col-span-1">
            <UsersList 
              onSelectUser={handleSelectUser}
              selectedUserId={selectedUserId}
              currentUserId={user.id}
            />
          </div>

          {/* Chat Area - Center */}
          <div className="lg:col-span-2">
            {selectedUserId ? (
              <EnhancedPrivateChat
                selectedUserId={selectedUserId}
                selectedUserName={selectedUserName}
                selectedUserAvatar={selectedUserAvatar}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="text-center p-8">
                  <div className="max-w-sm mx-auto">
                    <div className="relative mb-6">
                      <div className="flex items-center justify-center">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6">
                          <Code className="h-16 w-16 text-green-500" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-blue-500 rounded-full p-2">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                      Sélectionnez un étudiant
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Choisissez un étudiant pour commencer une conversation privée avec appels audio/vidéo.
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span>Audio</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span>Vidéo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
