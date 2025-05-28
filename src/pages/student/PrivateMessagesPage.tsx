
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UsersList } from '@/components/messaging/UsersList';
import { PrivateChat } from '@/components/messaging/PrivateChat';
import { usePrivateMessages } from '@/hooks/usePrivateMessages';
import { useAuthState } from '@/hooks/useAuthState';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';

export default function PrivateMessagesPage() {
  const { user } = useAuthState();
  const { messages, loading, sendMessage } = usePrivateMessages(user?.id);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  const handleSelectUser = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8">Veuillez vous connecter pour accéder aux messages privés</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 h-[calc(100vh-120px)]">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-3xl font-bold">Messages Privés</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Discutez en privé avec les autres membres de la communauté
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
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
              <PrivateChat
                selectedUserId={selectedUserId}
                selectedUserName={selectedUserName}
                currentUserId={user.id}
                messages={messages}
                onSendMessage={sendMessage}
                loading={loading}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Sélectionnez un utilisateur</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choisissez un utilisateur dans la liste pour commencer une conversation privée
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
