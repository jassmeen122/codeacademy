
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserFriend, UserWithStatus } from '@/types/messaging';
import { toast } from 'sonner';

export const useUserFriends = () => {
  const { user } = useAuthState();
  const [friends, setFriends] = useState<UserWithStatus[]>([]);
  const [pendingRequests, setPendingRequests] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Récupérer la liste des amis et des demandes en attente
  const fetchFriends = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Récupérer les amis (status = accepted)
      const { data: friendsData, error: friendsError } = await supabase
        .from('user_friends')
        .select(`
          id, 
          status, 
          created_at, 
          updated_at,
          friend:friend_id (
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');
      
      if (friendsError) throw friendsError;
      
      // Récupérer les demandes reçues (status = pending et l'utilisateur est le friend_id)
      const { data: receivedRequestsData, error: receivedRequestsError } = await supabase
        .from('user_friends')
        .select(`
          id, 
          status, 
          created_at, 
          updated_at,
          friend:user_id (
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      
      if (receivedRequestsError) throw receivedRequestsError;
      
      // Récupérer les statuts des amis
      const friendIds = [
        ...(friendsData?.map(f => f.friend?.id) || []).filter(Boolean),
        ...(receivedRequestsData?.map(r => r.friend?.id) || []).filter(Boolean)
      ];
      
      const { data: statusData } = await supabase
        .from('user_status')
        .select('*')
        .in('user_id', friendIds.length > 0 ? friendIds : ['no-results']);
      
      // Transformer les données d'amis avec leur statut en ligne
      const friendsWithStatus: UserWithStatus[] = (friendsData || []).map(f => {
        if (!f.friend) return null;
        const status = statusData?.find(s => s.user_id === f.friend.id);
        
        return {
          id: f.friend.id,
          full_name: f.friend.full_name,
          avatar_url: f.friend.avatar_url,
          email: f.friend.email,
          status: status?.status as 'online' | 'offline' || 'offline',
          last_active: status?.last_active || new Date().toISOString(),
          is_friend: true,
          friendship_status: 'accepted' as 'pending' | 'accepted' | 'rejected'
        };
      }).filter(Boolean) as UserWithStatus[];
      
      // Transformer les données des demandes reçues
      const requestsWithStatus: UserWithStatus[] = (receivedRequestsData || []).map(r => {
        if (!r.friend) return null;
        const status = statusData?.find(s => s.user_id === r.friend.id);
        
        return {
          id: r.friend.id,
          full_name: r.friend.full_name,
          avatar_url: r.friend.avatar_url,
          email: r.friend.email,
          status: status?.status as 'online' | 'offline' || 'offline',
          last_active: status?.last_active || new Date().toISOString(),
          is_friend: false,
          friendship_status: 'pending' as 'pending' | 'accepted' | 'rejected'
        };
      }).filter(Boolean) as UserWithStatus[];
      
      setFriends(friendsWithStatus);
      setPendingRequests(requestsWithStatus);
    } catch (error) {
      console.error('Erreur lors de la récupération des amis:', error);
      toast.error('Impossible de charger vos contacts');
    } finally {
      setLoading(false);
    }
  };
  
  // Envoyer une demande d'ami
  const sendFriendRequest = async (friendId: string) => {
    if (!user) return false;
    
    try {
      // Vérifier si une relation existe déjà
      const { data: existingRelation, error: checkError } = await supabase
        .from('user_friends')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRelation) {
        toast.error('Une relation existe déjà avec cet utilisateur');
        return false;
      }
      
      // Créer la relation
      const { error } = await supabase
        .from('user_friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast.success('Demande d\'ami envoyée');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
      toast.error('Impossible d\'envoyer la demande d\'ami');
      return false;
    }
  };
  
  // Accepter une demande d'ami
  const acceptFriendRequest = async (friendId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_friends')
        .update({ status: 'accepted' })
        .eq('user_id', friendId)
        .eq('friend_id', user.id);
      
      if (error) throw error;
      
      // Créer une relation bidirectionnelle
      const { error: insertError } = await supabase
        .from('user_friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'accepted'
        });
      
      if (insertError) throw insertError;
      
      fetchFriends();
      toast.success('Demande d\'ami acceptée');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
      toast.error('Impossible d\'accepter la demande d\'ami');
      return false;
    }
  };
  
  // Rejeter une demande d'ami
  const rejectFriendRequest = async (friendId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_friends')
        .update({ status: 'rejected' })
        .eq('user_id', friendId)
        .eq('friend_id', user.id);
      
      if (error) throw error;
      
      fetchFriends();
      toast.success('Demande d\'ami rejetée');
      return true;
    } catch (error) {
      console.error('Erreur lors du rejet de la demande d\'ami:', error);
      toast.error('Impossible de rejeter la demande d\'ami');
      return false;
    }
  };
  
  // Supprimer un ami
  const removeFriend = async (friendId: string) => {
    if (!user) return false;
    
    try {
      // Supprimer dans les deux sens
      await supabase
        .from('user_friends')
        .delete()
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);
      
      fetchFriends();
      toast.success('Contact supprimé');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du contact:', error);
      toast.error('Impossible de supprimer le contact');
      return false;
    }
  };
  
  // Rechercher des utilisateurs (pour ajouter des amis)
  const searchUsers = async (query: string) => {
    if (!user || !query || query.length < 3) return [];
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .neq('id', user.id)
        .limit(10);
      
      if (error) throw error;
      
      // Récupérer les relations d'amitié existantes
      const { data: friendships } = await supabase
        .from('user_friends')
        .select('friend_id, status')
        .eq('user_id', user.id);
      
      // Récupérer les relations d'amitié inverses (où l'utilisateur est le friend_id)
      const { data: inverseFriendships } = await supabase
        .from('user_friends')
        .select('user_id, status')
        .eq('friend_id', user.id);
      
      // Récupérer les statuts utilisateur
      const { data: statusData } = await supabase
        .from('user_status')
        .select('*')
        .in('user_id', data?.map(u => u.id) || ['no-results']);
      
      // Transformer les résultats avec le statut d'amitié et le statut en ligne
      const usersWithStatus: UserWithStatus[] = (data || []).map(u => {
        const friendship = friendships?.find(f => f.friend_id === u.id);
        const inverseFriendship = inverseFriendships?.find(f => f.user_id === u.id);
        const status = statusData?.find(s => s.user_id === u.id);
        
        const friendshipStatus = friendship?.status || inverseFriendship?.status;
        
        return {
          id: u.id,
          full_name: u.full_name,
          avatar_url: u.avatar_url,
          email: u.email,
          status: status?.status as 'online' | 'offline' || 'offline',
          last_active: status?.last_active || new Date().toISOString(),
          is_friend: !!(friendship?.status === 'accepted' || inverseFriendship?.status === 'accepted'),
          friendship_status: friendshipStatus as 'pending' | 'accepted' | 'rejected' | undefined
        };
      });
      
      return usersWithStatus;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      toast.error('Impossible de rechercher des utilisateurs');
      return [];
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);
  
  return {
    friends,
    pendingRequests,
    loading,
    fetchFriends,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    searchUsers
  };
};
