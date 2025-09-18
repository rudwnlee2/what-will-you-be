'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, UserPlus, Check, X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function FriendsPage() {
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Mock data for now
    setFriends([]);
    setFriendRequests([]);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Mock search results
      setSearchResults([]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddFriend = (userId: string, userName: string) => {
    console.log('Add friend:', userId, userName);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleAcceptRequest = (requestId: string, userName: string) => {
    console.log('Accept request:', requestId, userName);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
  };

  const handleRemoveFriend = (friendId: string) => {
    console.log('Remove friend:', friendId);
  };

  const handleViewFriend = (friendId: string) => {
    navigate(`/friends/info/${friendId}`);
  };

  const handleCreateFriendMission = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowMissionModal(true);
  };

  const generateFriendMission = async () => {
    if (!selectedFriend) return;

    setIsGeneratingMission(true);
    try {
      // Generate a random career-related mission for friends
      const careers = ['소프트웨어 개발자', '데이터 분석가', '마케팅 전문가', '디자이너', '교사'];
      const randomCareer = careers[Math.floor(Math.random() * careers.length)];

      const response = await fetch('/api/missions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerName: randomCareer,
          careerDetails: `${randomCareer}와 관련된 친구와 함께하는 미션`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        addFriendMission({
          careerId: `friend-${selectedFriend.id}-${Date.now()}`,
          careerName: randomCareer,
          title: `${selectedFriend.name}님과 함께: ${data.mission.title}`,
          content: data.mission.content,
          friendId: selectedFriend.id,
          friendName: selectedFriend.name,
        });

        setShowMissionModal(false);
        setSelectedFriend(null);

        // Navigate to missions page to show the new friend mission
        navigate('/missions');
      }
    } catch (error) {
      console.error('Failed to generate friend mission:', error);
    } finally {
      setIsGeneratingMission(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">친구 리스트</h1>
            <p className="text-gray-600">친구들과 함께 진로를 탐색해보세요</p>
          </div>

          {/* Friend Requests */}
          {friendRequests.filter((req) => req.type === 'received').length > 0 && (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">친구 요청</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {friendRequests
                    .filter((req) => req.type === 'received')
                    .map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">
                              {request.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{request.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id, request.name)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            수락
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            거절
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Friend Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">친구 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="아이디로 친구 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddFriend(user.id, user.name)}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        친구 추가
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Friends List */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                친구 목록 ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  아직 친구가 없습니다. 친구를 추가해보세요!
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">
                              {friend.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{friend.name}</span>
                          <p className="text-sm text-gray-500">
                            {friend.isOnline ? '온라인' : '오프라인'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCreateFriendMission(friend)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          함께 미션하기
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewFriend(friend.id)}>
                              정보 보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveFriend(friend.id)}
                              className="text-red-600"
                            >
                              친구 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showMissionModal && selectedFriend && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">친구와 함께 미션 생성</h3>
              <p className="text-gray-600 mb-6">
                <span className="font-medium">{selectedFriend.name}</span>님과 함께할 진로 탐색
                미션을 생성하시겠습니까?
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMissionModal(false);
                    setSelectedFriend(null);
                  }}
                  disabled={isGeneratingMission}
                >
                  취소
                </Button>
                <Button
                  onClick={generateFriendMission}
                  disabled={isGeneratingMission}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGeneratingMission ? '생성 중...' : '미션 생성'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
