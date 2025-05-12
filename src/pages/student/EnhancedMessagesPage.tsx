
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthState } from '@/hooks/useAuthState';
import { useEnhancedPrivateMessages } from '@/hooks/useEnhancedPrivateMessages';
import { useUserStatus } from '@/hooks/useUserStatus';
import { useUserFriends } from '@/hooks/useUserFriends';
import { useUserCalls } from '@/hooks/useUserCalls';
import { EnhancedPrivateMessage, UserWithStatus, EnhancedConversation } from '@/types/messaging';
import {
  Search,
  Send,
  ArrowLeft,
  Mic,
  MicOff,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Trash2,
  Check,
  Clock,
  User,
  UserPlus,
  Users,
  Image,
  MessageCircle,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

const EnhancedMessagesPage = () => {
  // États généraux
  const { user } = useAuthState();
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');
  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'groups'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserWithStatus[]>([]);
  const [typing, setTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<EnhancedPrivateMessage | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  
  // Messages et contacts
  const {
    conversations,
    loading: messagesLoading,
    error: messagesError,
    fetchMessages,
    sendMessage,
    startRecording,
    stopRecording,
    sendVoiceMessage,
    playVoiceMessage,
    isRecording,
    recordingTime
  } = useEnhancedPrivateMessages();
  const [messages, setMessages] = useState<EnhancedPrivateMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<EnhancedConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // Amis et statut
  const {
    friends,
    pendingRequests,
    loading: friendsLoading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    searchUsers
  } = useUserFriends();
  const { formatOnlineStatus } = useUserStatus();
  
  // Appels
  const {
    initiateCall,
    endCall,
    currentCall,
    loading: callLoading
  } = useUserCalls();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // Filtrage des conversations et amis
  const filteredConversations = conversations.filter(conv => 
    conv.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    searchQuery === ''
  );
  
  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    searchQuery === ''
  );
  
  // Gérer le redimensionnement de la fenêtre pour la vue mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileView('list');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Charger les messages quand la conversation sélectionnée change
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        setLoadingMessages(true);
        const msgs = await fetchMessages(selectedConversation.user_id);
        if (msgs) {
          setMessages(msgs);
          setScrollToBottom(true);
        }
        setLoadingMessages(false);
        
        if (window.innerWidth < 768) {
          setMobileView('conversation');
        }
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        setMessages([]);
      }
    };
    
    loadMessages();
  }, [selectedConversation, fetchMessages]);
  
  // Faire défiler vers le bas lorsque les messages changent
  useEffect(() => {
    if (scrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setScrollToBottom(false);
    }
  }, [messages, scrollToBottom]);
  
  // Effectuer une recherche lorsque la requête change
  useEffect(() => {
    // Pour la recherche d'utilisateurs externes
    const performSearch = async () => {
      if (searchQuery.length >= 3 && showUserSearch) {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };
    
    const delaySearch = setTimeout(performSearch, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, searchUsers, showUserSearch]);
  
  // Gérer le mode sombre
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Envoyer un message
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    const message = await sendMessage(
      selectedConversation.user_id, 
      newMessage,
      replyTo?.id || undefined
    );
    
    if (message) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setReplyTo(null);
      setScrollToBottom(true);
    }
  };
  
  // Envoyer un message vocal
  const handleVoiceMessage = async () => {
    if (!selectedConversation) return;
    
    if (isRecording) {
      try {
        const audioBlob = await stopRecording();
        await sendVoiceMessage(selectedConversation.user_id, audioBlob);
        
        // Recharger les messages pour voir le nouveau message vocal
        const msgs = await fetchMessages(selectedConversation.user_id);
        if (msgs) {
          setMessages(msgs);
          setScrollToBottom(true);
        }
      } catch (error) {
        console.error('Error sending voice message:', error);
        toast.error('Impossible d\'envoyer le message vocal');
      }
    } else {
      await startRecording();
    }
  };
  
  // Gérer les appels
  const handleCall = async (type: 'audio' | 'video') => {
    if (!selectedConversation) return;
    
    const call = await initiateCall(selectedConversation.user_id, type);
    if (call) {
      toast.success(
        `Appel ${type === 'audio' ? 'audio' : 'vidéo'} en cours`,
        { description: `Appel vers ${selectedConversation.full_name}` }
      );
      
      // Simuler un appel pour la démonstration (30 secondes)
      setTimeout(() => {
        endCall(call.id, 'completed');
        toast.info('Appel terminé', { description: `Durée: 30 secondes` });
      }, 30000);
    }
  };
  
  // Gérer l'appui sur les touches
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Formater le temps d'enregistrement
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simuler un indicateur de frappe
  const handleTyping = () => {
    setTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  };
  
  // Changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'chats' | 'friends' | 'groups');
    setSearchQuery('');
  };
  
  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <p className="text-center py-8">Veuillez vous connecter pour utiliser la messagerie</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-4 px-2 md:py-6 md:px-4">
        <h1 className="text-2xl font-bold mb-4 md:mb-6">Messages</h1>
        
        <Card className={`h-[calc(100vh-220px)] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar: liste des conversations */}
            <div className={`${mobileView === 'list' ? 'block' : 'hidden'} md:block md:w-1/3 border-r flex flex-col h-full`}>
              <CardHeader className="p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <Tabs defaultValue="chats" value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="chats" className="flex-1">Discussions</TabsTrigger>
                      <TabsTrigger value="friends" className="flex-1">Contacts</TabsTrigger>
                      <TabsTrigger value="groups" className="flex-1">Groupes</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button variant="ghost" size="icon" onClick={() => setShowUserSearch(!showUserSearch)}>
                    <UserPlus className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Barre de recherche */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={activeTab === 'chats' ? "Rechercher une conversation..." : "Rechercher un contact..."}
                    className="pl-9 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              {/* Recherche d'utilisateurs pour ajouter des amis */}
              {showUserSearch && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800">
                  <h3 className="text-sm font-medium mb-2">Ajouter des contacts</h3>
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-gray-700">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'Utilisateur'} />
                              <AvatarFallback>{(user.full_name || 'U').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.full_name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          {!user.is_friend && user.friendship_status !== 'pending' ? (
                            <Button 
                              size="sm" 
                              onClick={() => sendFriendRequest(user.id)}
                            >
                              Ajouter
                            </Button>
                          ) : (
                            <Badge variant={user.is_friend ? "secondary" : "outline"}>
                              {user.is_friend ? "Contact" : "Demande envoyée"}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length >= 3 ? (
                    <p className="text-sm text-gray-500 py-2">Aucun utilisateur trouvé</p>
                  ) : (
                    <p className="text-sm text-gray-500 py-2">Saisissez au moins 3 caractères...</p>
                  )}
                </div>
              )}
              
              <CardContent className="p-0 overflow-hidden flex-grow">
                <ScrollArea className="h-full">
                  <TabsContent value="chats" className="m-0">
                    {messagesLoading ? (
                      <div className="p-4 text-center">Chargement des conversations...</div>
                    ) : messagesError ? (
                      <div className="p-4 text-center text-red-500">Erreur: {messagesError}</div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Aucune conversation</div>
                    ) : (
                      <div>
                        {filteredConversations.map((conversation) => (
                          <div key={conversation.user_id}>
                            <div 
                              className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                                selectedConversation?.user_id === conversation.user_id ? 
                                'bg-gray-100 dark:bg-gray-800' : ''
                              }`}
                              onClick={() => setSelectedConversation(conversation)}
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12 mr-3">
                                  <AvatarImage src={conversation.avatar_url || ''} alt={conversation.full_name || 'Utilisateur'} />
                                  <AvatarFallback>{(conversation.full_name || 'U').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span 
                                  className={`absolute bottom-0 right-1 h-3 w-3 rounded-full border-2 border-white 
                                  ${conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                                ></span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-semibold truncate">
                                    {conversation.full_name || 'Utilisateur'}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(conversation.last_message_date), 'HH:mm')}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <p className="text-gray-600 dark:text-gray-400 truncate flex-1">
                                    {conversation.last_message}
                                  </p>
                                  {conversation.unread_count > 0 && (
                                    <Badge 
                                      className="ml-2 bg-green-500 hover:bg-green-600"
                                    >
                                      {conversation.unread_count}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {conversation.status === 'online' 
                                    ? 'En ligne' 
                                    : `Vu ${formatDistanceToNow(new Date(conversation.last_active), { 
                                        addSuffix: true, 
                                        locale: fr 
                                      })}`
                                  }
                                </p>
                              </div>
                            </div>
                            <Separator />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="friends" className="m-0">
                    {friendsLoading ? (
                      <div className="p-4 text-center">Chargement des contacts...</div>
                    ) : filteredFriends.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {searchQuery ? "Aucun contact trouvé" : "Aucun contact"}
                      </div>
                    ) : (
                      <div>
                        {filteredFriends.map((friend) => (
                          <div key={friend.id}>
                            <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                              <div className="relative">
                                <Avatar className="h-12 w-12 mr-3">
                                  <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || 'Contact'} />
                                  <AvatarFallback>{(friend.full_name || 'U').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span 
                                  className={`absolute bottom-0 right-1 h-3 w-3 rounded-full border-2 border-white 
                                  ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                                ></span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{friend.full_name || 'Contact'}</h3>
                                <p className="text-sm text-gray-500">
                                  {friend.status === 'online' 
                                    ? 'En ligne'
                                    : `Vu ${formatDistanceToNow(new Date(friend.last_active), { 
                                        addSuffix: true, 
                                        locale: fr 
                                      })}`
                                  }
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Trouve ou crée une conversation avec cet ami
                                    const conversation = conversations.find(c => c.user_id === friend.id);
                                    if (conversation) {
                                      setSelectedConversation(conversation);
                                      setActiveTab('chats');
                                    } else {
                                      setSelectedConversation({
                                        user_id: friend.id,
                                        full_name: friend.full_name,
                                        avatar_url: friend.avatar_url,
                                        status: friend.status,
                                        last_active: friend.last_active,
                                        last_message: "",
                                        last_message_date: new Date().toISOString(),
                                        unread_count: 0
                                      });
                                      setActiveTab('chats');
                                    }
                                  }}
                                >
                                  <MessageCircle className="h-5 w-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCall('audio');
                                  }}
                                >
                                  <Phone className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                            <Separator />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {pendingRequests.length > 0 && (
                      <>
                        <h3 className="font-medium text-sm p-3 bg-gray-50 dark:bg-gray-800">
                          Demandes d'amitié ({pendingRequests.length})
                        </h3>
                        {pendingRequests.map(request => (
                          <div key={request.id} className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={request.avatar_url || ''} alt={request.full_name || 'Utilisateur'} />
                              <AvatarFallback>{(request.full_name || 'U').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{request.full_name || 'Utilisateur'}</h3>
                              <p className="text-xs text-gray-500">Souhaite vous ajouter comme contact</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => acceptFriendRequest(request.id)}>
                                Accepter
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => rejectFriendRequest(request.id)}>
                                Refuser
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="groups" className="m-0">
                    <div className="p-4 text-center">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <h3 className="font-medium">Groupes</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Les discussions de groupe seront disponibles prochainement
                      </p>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </CardContent>
            </div>
            
            {/* Zone de conversation */}
            <div className={`${mobileView === 'conversation' ? 'block' : 'hidden'} md:block md:w-2/3 flex flex-col h-full overflow-hidden`}>
              {selectedConversation ? (
                <>
                  <CardHeader className="p-3 md:p-4 flex-shrink-0 border-b">
                    <div className="flex items-center">
                      {/* Bouton retour sur mobile */}
                      {window.innerWidth < 768 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-2" 
                          onClick={() => setMobileView('list')}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}
                      
                      <div className="relative">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage 
                            src={selectedConversation.avatar_url || ''} 
                            alt={selectedConversation.full_name || 'Utilisateur'} 
                          />
                          <AvatarFallback>
                            {(selectedConversation.full_name || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-1 h-2.5 w-2.5 rounded-full border-2 border-white 
                          ${selectedConversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                        ></span>
                      </div>
                      
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {selectedConversation.full_name || 'Utilisateur'}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {typing ? 'En train d\'écrire...' : (
                            selectedConversation.status === 'online' 
                              ? 'En ligne'
                              : `Vu ${formatDistanceToNow(new Date(selectedConversation.last_active), { 
                                  addSuffix: true, 
                                  locale: fr 
                                })}`
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCall('audio')}
                          disabled={callLoading}
                        >
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCall('video')}
                          disabled={callLoading}
                        >
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Zone des messages */}
                  <div 
                    className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
                    ref={messageListRef}
                  >
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                          <p className="mt-2">Chargement des messages...</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                          <MessageCircle className="h-12 w-12" />
                        </div>
                        <p>Aucun message. Commencez la conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message, index) => {
                          const isFromMe = message.sender_id === user.id;
                          const showAvatar = !isFromMe && (
                            index === 0 || 
                            messages[index - 1].sender_id !== message.sender_id
                          );
                          
                          return (
                            <div 
                              key={message.id} 
                              className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                            >
                              {!isFromMe && showAvatar && (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarImage 
                                    src={message.sender?.avatar_url || ''} 
                                    alt={message.sender?.full_name || 'Utilisateur'} 
                                  />
                                  <AvatarFallback>
                                    {(message.sender?.full_name || 'U').charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              {!isFromMe && !showAvatar && (
                                <div className="w-8 mr-2"></div>
                              )}
                              <div className={`max-w-[75%]`}>
                                {message.reply_to_message && (
                                  <div 
                                    className={`text-xs border-l-2 p-1 mb-1 bg-gray-100 dark:bg-gray-800 
                                    ${isFromMe ? 'border-blue-300' : 'border-gray-300'}`}
                                  >
                                    <span className="font-medium text-blue-500">
                                      {message.reply_to_message.sender_id === user.id ? 'Vous' : message.reply_to_message.sender?.full_name}
                                    </span>
                                    <p className="truncate">{message.reply_to_message.content}</p>
                                  </div>
                                )}
                                <div 
                                  className={`p-3 rounded-lg ${
                                    isFromMe 
                                      ? 'bg-blue-500 text-white rounded-br-none' 
                                      : 'bg-white dark:bg-gray-800 rounded-bl-none'
                                  }`}
                                >
                                  {message.message_type === 'voice' ? (
                                    <div className="flex items-center">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className={`p-1 ${isFromMe ? 'text-white hover:text-white hover:bg-blue-600' : ''}`}
                                        onClick={() => {
                                          if (message.voice_message) {
                                            playVoiceMessage(message.voice_message);
                                          }
                                        }}
                                      >
                                        <Play className="h-5 w-5 mr-2" />
                                        {message.voice_message?.duration 
                                          ? formatRecordingTime(message.voice_message.duration) 
                                          : "0:00"}
                                      </Button>
                                    </div>
                                  ) : (
                                    message.content
                                  )}
                                </div>
                                <div className="flex items-center justify-end space-x-1 text-xs text-gray-500 mt-1">
                                  <span>
                                    {format(new Date(message.created_at), 'HH:mm')}
                                  </span>
                                  {isFromMe && (
                                    <span>
                                      {message.read ? (
                                        <Check className="h-3 w-3 text-blue-500" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="group relative">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setReplyTo(message)}
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  
                  {/* Zone de réponse à un message */}
                  {replyTo && (
                    <div className="p-2 border-t bg-gray-100 dark:bg-gray-800 flex items-center">
                      <div className="flex-1 border-l-2 border-blue-500 pl-2">
                        <p className="text-xs font-medium">
                          Réponse à {replyTo.sender_id === user.id ? 'vous-même' : replyTo.sender?.full_name}
                        </p>
                        <p className="text-sm truncate">{replyTo.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setReplyTo(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Zone de saisie */}
                  <CardFooter className="p-2 border-t flex items-center">
                    <Button variant="ghost" size="icon">
                      <Smile 
                        className="h-5 w-5 text-gray-500"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </Button>
                    <div className="flex-1 mx-2">
                      <Input 
                        ref={inputRef}
                        placeholder="Message..."
                        className="w-full"
                        value={newMessage} 
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    {newMessage.trim() ? (
                      <Button size="icon" className="bg-green-500 hover:bg-green-600" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        size="icon" 
                        className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
                        onClick={handleVoiceMessage}
                      >
                        {isRecording ? (
                          <div className="flex items-center">
                            <MicOff className="h-4 w-4" />
                            <span className="ml-1 text-xs">{formatRecordingTime(recordingTime)}</span>
                          </div>
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                    <MessageCircle className="h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Vos messages</h3>
                  <p className="text-center max-w-md">
                    Sélectionnez une conversation pour commencer à discuter ou envoyez un message à un contact.
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4 bg-green-500 hover:bg-green-600">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Nouveau message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nouveau message</DialogTitle>
                        <DialogDescription>
                          Sélectionnez un contact pour commencer une nouvelle discussion
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative my-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          placeholder="Rechercher un contact..." 
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <ScrollArea className="h-72">
                        {filteredFriends.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun contact trouvé
                          </div>
                        ) : (
                          filteredFriends.map(friend => (
                            <div 
                              key={friend.id}
                              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                              onClick={() => {
                                // Trouve ou crée une conversation
                                const conversation = conversations.find(c => c.user_id === friend.id);
                                if (conversation) {
                                  setSelectedConversation(conversation);
                                } else {
                                  setSelectedConversation({
                                    user_id: friend.id,
                                    full_name: friend.full_name,
                                    avatar_url: friend.avatar_url,
                                    status: friend.status,
                                    last_active: friend.last_active,
                                    last_message: "",
                                    last_message_date: new Date().toISOString(),
                                    unread_count: 0
                                  });
                                }
                              }}
                            >
                              <div className="relative">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || 'Contact'} />
                                  <AvatarFallback>{(friend.full_name || 'U').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span 
                                  className={`absolute bottom-0 right-1 h-2.5 w-2.5 rounded-full border-2 border-white 
                                  ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                                ></span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{friend.full_name || 'Contact'}</h3>
                                <p className="text-xs text-gray-500">
                                  {friend.status === 'online' 
                                    ? 'En ligne'
                                    : `Vu ${formatDistanceToNow(new Date(friend.last_active), { 
                                        addSuffix: true, 
                                        locale: fr 
                                      })}`
                                  }
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </ScrollArea>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Annuler</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedMessagesPage;
