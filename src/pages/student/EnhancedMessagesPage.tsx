
import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  Mic,
  MicOff,
  User,
  UserPlus,
  Clock,
  Search,
  X,
  Check,
  MoreHorizontal,
  MessageSquare,
  ChevronDown,
  Reply
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserStatus } from '@/hooks/useUserStatus';
import { useUserFriends } from '@/hooks/useUserFriends';
import { useEnhancedPrivateMessages } from '@/hooks/useEnhancedPrivateMessages';
import { useUserCalls } from '@/hooks/useUserCalls';
import { EnhancedPrivateMessage, UserWithStatus } from '@/types/messaging';

const EnhancedMessagesPage = () => {
  const { user } = useAuthState();
  const { updateStatus, formatOnlineStatus, getUserStatus } = useUserStatus();
  const {
    conversations,
    loading: messagesLoading,
    fetchMessages,
    sendMessage,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    sendVoiceMessage,
    playVoiceMessage
  } = useEnhancedPrivateMessages();
  const {
    friends,
    pendingRequests,
    loading: friendsLoading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    searchUsers
  } = useUserFriends();
  const { initiateCall, endCall, currentCall } = useUserCalls();

  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<EnhancedPrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserWithStatus[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithStatus | null>(null);
  const [activeTab, setActiveTab] = useState('conversations');
  const [replyingTo, setReplyingTo] = useState<EnhancedPrivateMessage | null>(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileView('list');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Set user as online when the component mounts
  useEffect(() => {
    if (user) {
      updateStatus('online');
    }
  }, [user]);
  
  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        setLoadingMessages(true);
        const msgs = await fetchMessages(selectedConversation.user_id);
        if (msgs) {
          setMessages(msgs);
        }
        setLoadingMessages(false);
        if (window.innerWidth < 768) {
          setMobileView('conversation');
        }
      } else {
        setMessages([]);
      }
    };
    
    loadMessages();
  }, [selectedConversation]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (searchQuery.length >= 3) {
      setLoadingSearch(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
        setLoadingSearch(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    const message = await sendMessage(
      selectedConversation.user_id,
      newMessage,
      replyingTo?.id
    );
    
    if (message) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setReplyingTo(null);
    }
  };
  
  const handleRecordVoiceMessage = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (selectedConversation) {
        await sendVoiceMessage(selectedConversation.user_id, audioBlob);
        // Refresh messages
        const msgs = await fetchMessages(selectedConversation.user_id);
        if (msgs) {
          setMessages(msgs);
        }
      }
    } else {
      startRecording();
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleUserClick = (user: UserWithStatus) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };
  
  const handleStartCall = async (userId: string, type: 'audio' | 'video') => {
    const call = await initiateCall(userId, type);
    if (call) {
      setCallType(type);
      setShowCallDialog(true);
    }
  };
  
  const handleEndCall = async () => {
    if (currentCall) {
      await endCall(currentCall.id);
    }
    setShowCallDialog(false);
  };
  
  const renderTypingIndicator = () => {
    // Simulation d'un utilisateur qui tape
    // Dans une implémentation réelle, cela serait basé sur des websockets/realtime
    return Math.random() > 0.7 ? (
      <div className="text-xs text-gray-500 italic ml-12 mb-2">
        En train d'écrire...
      </div>
    ) : null;
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <Card>
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
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Messagerie</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Liste des conversations et contacts */}
          <div className={`md:block ${mobileView === 'list' ? 'block' : 'hidden'}`}>
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Messages</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowUserDialog(true)}>
                    <UserPlus className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Barre de recherche */}
                <div className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des contacts..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <Tabs 
                defaultValue="conversations" 
                className="flex-1 flex flex-col"
                onValueChange={setActiveTab}
                value={activeTab}
              >
                <TabsList className="grid grid-cols-2 mx-4">
                  <TabsTrigger value="conversations">Conversations</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>
                
                <Separator className="my-2" />
                
                <TabsContent value="conversations" className="flex-1 overflow-y-auto">
                  {messagesLoading ? (
                    <div className="p-4 text-center">Chargement des conversations...</div>
                  ) : searchQuery && searchQuery.length >= 3 ? (
                    <div className="space-y-1">
                      {loadingSearch ? (
                        <div className="p-4 text-center">Recherche en cours...</div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Aucun résultat trouvé</div>
                      ) : (
                        searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md mx-1"
                            onClick={() => handleUserClick(user)}
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                              <AvatarFallback>{(user.full_name || 'U').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">{user.full_name || 'Utilisateur'}</h3>
                              </div>
                              <div className="flex items-center">
                                <p className="text-xs text-gray-500">
                                  {user.status === 'online' ? 'En ligne' : 'Hors ligne'}
                                </p>
                                {user.is_friend && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Contact
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Aucune conversation</div>
                  ) : (
                    <div>
                      {conversations.map((conversation) => (
                        <div key={conversation.user_id}>
                          <div 
                            className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md mx-1 ${
                              selectedConversation?.user_id === conversation.user_id ? 'bg-gray-100 dark:bg-gray-800' : ''
                            }`}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={conversation.avatar_url || ''} alt={conversation.full_name || 'User'} />
                                <AvatarFallback>{(conversation.full_name || 'U').charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span 
                                className={`absolute bottom-0 right-2 h-3 w-3 rounded-full border-2 border-white ${
                                  conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                }`} 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">{conversation.full_name || 'Utilisateur'}</h3>
                                <div className="flex items-center">
                                  {conversation.unread_count > 0 && (
                                    <Badge variant="destructive" className="mr-1">
                                      {conversation.unread_count}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(conversation.last_message_date), { 
                                      addSuffix: true,
                                      locale: fr
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 truncate flex-1">
                                  {conversation.last_message}
                                </p>
                                <div className="flex space-x-1 ml-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartCall(conversation.user_id, 'audio');
                                    }}
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartCall(conversation.user_id, 'video');
                                    }}
                                  >
                                    <Video className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Separator className="my-1 mx-4" />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="contacts" className="flex-1 overflow-y-auto">
                  {friendsLoading ? (
                    <div className="p-4 text-center">Chargement des contacts...</div>
                  ) : friends.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Aucun contact pour l'instant
                      <Button 
                        variant="link" 
                        onClick={() => setShowUserDialog(true)}
                        className="block mx-auto mt-2"
                      >
                        Ajouter des contacts
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {pendingRequests.length > 0 && (
                        <div className="px-4 py-2">
                          <h3 className="text-sm font-medium flex items-center">
                            Demandes d'ami
                            <Badge variant="secondary" className="ml-2">
                              {pendingRequests.length}
                            </Badge>
                          </h3>
                          <div className="mt-2 space-y-2">
                            {pendingRequests.map((request) => (
                              <div key={request.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={request.avatar_url || ''} alt={request.full_name || 'User'} />
                                    <AvatarFallback>{(request.full_name || 'U').charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{request.full_name || 'Utilisateur'}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7" 
                                    onClick={() => acceptFriendRequest(request.id)}
                                  >
                                    <Check className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7"
                                    onClick={() => rejectFriendRequest(request.id)}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-2" />
                        </div>
                      )}
                      
                      <h3 className="px-4 py-2 text-sm font-medium">Tous les contacts</h3>
                      {friends.map((friend) => (
                        <div key={friend.id}>
                          <div 
                            className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md mx-1"
                            onClick={() => {
                              // Trouver ou créer une conversation avec cet ami
                              const existingConversation = conversations.find(c => c.user_id === friend.id);
                              if (existingConversation) {
                                setSelectedConversation(existingConversation);
                              } else {
                                setSelectedConversation({
                                  user_id: friend.id,
                                  full_name: friend.full_name,
                                  avatar_url: friend.avatar_url,
                                  status: friend.status,
                                  last_active: friend.last_active,
                                  last_message: '',
                                  last_message_date: new Date().toISOString(),
                                  unread_count: 0
                                });
                              }
                              setActiveTab('conversations');
                            }}
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || 'User'} />
                                <AvatarFallback>{(friend.full_name || 'U').charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span 
                                className={`absolute bottom-0 right-2 h-3 w-3 rounded-full border-2 border-white ${
                                  friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                }`} 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{friend.full_name || 'Utilisateur'}</h3>
                              <p className="text-xs text-gray-500">
                                {friend.status === 'online' 
                                  ? 'En ligne' 
                                  : `Vu ${formatDistanceToNow(new Date(friend.last_active), { 
                                      addSuffix: true, 
                                      locale: fr
                                    })}`}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartCall(friend.id, 'audio');
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartCall(friend.id, 'video');
                                }}
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-1 mx-4" />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Messages */}
          <div className={`md:col-span-2 md:block ${mobileView === 'conversation' ? 'block' : 'hidden'}`}>
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
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
                              alt={selectedConversation.full_name || 'User'} 
                            />
                            <AvatarFallback>
                              {(selectedConversation.full_name || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span 
                            className={`absolute bottom-0 right-2 h-3 w-3 rounded-full border-2 border-white ${
                              selectedConversation.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                            }`} 
                          />
                        </div>
                        <div>
                          <CardTitle>{selectedConversation.full_name || 'Utilisateur'}</CardTitle>
                          <p className="text-xs text-gray-500">
                            {selectedConversation.status === 'online' 
                              ? 'En ligne' 
                              : `Vu ${formatDistanceToNow(new Date(selectedConversation.last_active), { 
                                  addSuffix: true,
                                  locale: fr
                                })}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleStartCall(selectedConversation.user_id, 'audio')}
                        >
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleStartCall(selectedConversation.user_id, 'video')}
                        >
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Separator />
                  
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center">
                        <p>Chargement des messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>Aucun message. Commencez à discuter !</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const isFromMe = message.sender_id === user.id;
                          const showAvatar = index === 0 || 
                            messages[index - 1].sender_id !== message.sender_id ||
                            new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 5 * 60 * 1000;
                          
                          return (
                            <div 
                              key={message.id} 
                              className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                            >
                              {!isFromMe && showAvatar ? (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarImage 
                                    src={message.sender?.avatar_url || ''} 
                                    alt={message.sender?.full_name || 'User'} 
                                  />
                                  <AvatarFallback>
                                    {(message.sender?.full_name || 'U').charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : !isFromMe ? (
                                <div className="w-8 mr-2" />
                              ) : null}
                              
                              <div className={`max-w-[70%] group`}>
                                {/* Message répondu */}
                                {message.reply_to_message && (
                                  <div 
                                    className={`text-xs p-2 mb-1 rounded-lg ${
                                      isFromMe 
                                        ? 'bg-blue-100 text-blue-800 mr-2' 
                                        : 'bg-gray-100 dark:bg-gray-600 ml-2'
                                    }`}
                                  >
                                    <p className="font-medium">
                                      {message.reply_to_message.sender_id === user.id 
                                        ? 'Vous' 
                                        : message.reply_to_message.sender?.full_name || 'Utilisateur'}
                                    </p>
                                    <p className="truncate">
                                      {message.reply_to_message.content}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Contenu du message */}
                                <div 
                                  className={`p-3 rounded-lg relative ${
                                    isFromMe 
                                      ? 'bg-blue-500 text-white rounded-br-none' 
                                      : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                                  } group-hover:bg-opacity-90 transition-colors`}
                                >
                                  {message.message_type === 'text' ? (
                                    <p>{message.content}</p>
                                  ) : message.voice_message ? (
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant={isFromMe ? "secondary" : "outline"} 
                                        size="icon" 
                                        className="h-8 w-8" 
                                        onClick={() => playVoiceMessage(message.voice_message!)}
                                      >
                                        <Play className="h-4 w-4" />
                                      </Button>
                                      <div className="flex-1">
                                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded-full">
                                          <div 
                                            className={`h-1 ${isFromMe ? 'bg-white' : 'bg-blue-500'} rounded-full`} 
                                            style={{ width: '50%' }} 
                                          />
                                        </div>
                                      </div>
                                      <span className="text-xs">
                                        {message.voice_message.duration}s
                                      </span>
                                    </div>
                                  ) : (
                                    <p>Message audio</p>
                                  )}
                                  
                                  {/* Boutons d'action sur survol */}
                                  <div 
                                    className={`absolute -bottom-3 ${isFromMe ? 'left-0' : 'right-0'} 
                                      opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1`}
                                  >
                                    <Button 
                                      variant="secondary" 
                                      size="icon" 
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => setReplyingTo(message)}
                                    >
                                      <Reply className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(message.created_at), { 
                                    addSuffix: true,
                                    locale: fr
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Indicateur "en train d'écrire" */}
                        {renderTypingIndicator()}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </CardContent>
                  
                  {/* Zone de réponse */}
                  {replyingTo && (
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
                      <div className="flex items-center">
                        <Reply className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs font-medium">
                            En réponse à {replyingTo.sender_id === user.id 
                              ? 'vous-même' 
                              : replyingTo.sender?.full_name || 'Utilisateur'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {replyingTo.content}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setReplyingTo(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="p-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                        onClick={handleRecordVoiceMessage}
                      >
                        {isRecording ? (
                          <div className="flex items-center">
                            <MicOff className="h-5 w-5 mr-2" />
                            <span>{formatTime(recordingTime)}</span>
                          </div>
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </Button>
                      <Input 
                        placeholder="Tapez un message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                        disabled={isRecording}
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isRecording}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 flex-col p-6">
                  <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-2">Aucune conversation sélectionnée</p>
                  <p className="text-sm text-center">
                    Sélectionnez une conversation ou commencez à discuter avec un contact
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowUserDialog(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter des contacts
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dialog pour gérer les contacts */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer les contacts</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des utilisateurs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {loadingSearch ? (
                <div className="p-4 text-center">Recherche en cours...</div>
              ) : searchQuery.length < 3 ? (
                <p className="text-sm text-center text-gray-500">
                  Saisissez au moins 3 caractères pour rechercher
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-center text-gray-500">
                  Aucun utilisateur trouvé
                </p>
              ) : (
                searchResults.map((searchResult) => (
                  <div
                    key={searchResult.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={searchResult.avatar_url || ''} />
                        <AvatarFallback>{(searchResult.full_name || 'U').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{searchResult.full_name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500">{searchResult.email}</p>
                      </div>
                    </div>
                    {searchResult.is_friend ? (
                      <Badge>Contact</Badge>
                    ) : searchResult.friendship_status === 'pending' ? (
                      <Badge variant="outline">En attente</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendFriendRequest(searchResult.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour les appels */}
      <Dialog open={showCallDialog} onOpenChange={(open) => {
        if (!open) {
          handleEndCall();
        }
        setShowCallDialog(open);
      }}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center py-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage 
                src={selectedUser?.avatar_url || selectedConversation?.avatar_url || ''} 
                alt={selectedUser?.full_name || selectedConversation?.full_name || 'User'} 
              />
              <AvatarFallback className="text-3xl">
                {(selectedUser?.full_name || selectedConversation?.full_name || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-1">
              {selectedUser?.full_name || selectedConversation?.full_name || 'Utilisateur'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {callType === 'audio' ? 'Appel audio' : 'Appel vidéo'} en cours...
            </p>
            
            <div className="flex space-x-4">
              <Button 
                size="icon" 
                variant="destructive" 
                className="h-14 w-14 rounded-full"
                onClick={handleEndCall}
              >
                <Phone className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EnhancedMessagesPage;
