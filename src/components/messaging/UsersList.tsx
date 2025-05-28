
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';

interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  status: 'online' | 'offline';
}

interface UsersListProps {
  onSelectUser: (userId: string, userName: string) => void;
  selectedUserId?: string;
  currentUserId?: string;
}

export const UsersList = ({ onSelectUser, selectedUserId, currentUserId }: UsersListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users with their profiles and status
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            avatar_url,
            role
          `)
          .neq('id', currentUserId);

        if (profilesError) throw profilesError;

        // Fetch user status information
        const { data: statusData } = await supabase
          .from('user_status')
          .select('user_id, status, last_active');

        // Create a map of user statuses
        const statusMap = new Map(statusData?.map(status => [
          status.user_id, 
          {
            status: status.status,
            last_active: status.last_active
          }
        ]) || []);

        // Combine profile data with status
        const usersWithStatus = (profiles || []).map(profile => {
          const userStatus = statusMap.get(profile.id);
          const now = new Date();
          const lastActive = userStatus?.last_active ? new Date(userStatus.last_active) : null;
          const isOnline = lastActive && (now.getTime() - lastActive.getTime()) < 5 * 60 * 1000; // 5 minutes

          return {
            ...profile,
            status: (isOnline ? 'online' : 'offline') as 'online' | 'offline'
          };
        });

        setUsers(usersWithStatus);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchUsers();
      
      // Refresh status every 30 seconds
      const interval = setInterval(fetchUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-500" />
          Utilisateurs CodeAcademy ({users.length})
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cliquez sur un utilisateur pour démarrer une conversation
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user.id, user.full_name || 'Utilisateur')}
              className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                selectedUserId === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar_url || ''} />
                  <AvatarFallback className="text-sm font-medium">
                    {(user.full_name || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                  user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate mb-1">
                  {user.full_name || 'Utilisateur'}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={user.status === 'online' ? 'default' : 'secondary'} 
                    className="text-xs px-2 py-0.5"
                  >
                    {user.status === 'online' ? '🟢 En ligne' : '🔴 Hors ligne'}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs px-2 py-0.5 capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
