import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Star, Share2, UserMinus } from 'lucide-react';
import {
  getFriendProfile,
  removeFriendById,
  shareRecommendations,
  type FriendProfile,
  type FriendCareer,
} from '@/api/friends';

export default function FriendInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendId = searchParams.get('id');

  const [friendProfile, setFriendProfile] = useState<FriendProfile | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<FriendCareer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (friendId) {
      const profile = getFriendProfile(friendId);
      setFriendProfile(profile);
    }
  }, [friendId]);

  const handleDeleteFriend = () => {
    if (friendId && removeFriendById(friendId)) {
      router.push('/friends');
    }
  };

  const handleShareRecommendations = () => {
    if (friendId && shareRecommendations(friendId)) {
      alert('추천 결과를 공유했습니다!');
    }
  };

  if (!friendProfile) {
    return (
      <div className="min-h-screen bg-purple-50 pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-gray-500">친구 정보를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push('/friends')} className="mt-4">
              친구 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>뒤로 가기</span>
          </Button>

          {/* Friend Profile Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">친구 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">
                      {friendProfile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      friendProfile.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{friendProfile.name}</h2>
                  <p className="text-gray-600">{friendProfile.school}</p>
                  <p className="text-sm text-gray-500">{friendProfile.status}</p>
                  <p className="text-sm font-medium text-green-600">
                    {friendProfile.isOnline ? '온라인' : '오프라인'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Friend's Career Recommendations */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">진로 추천 결과</CardTitle>
            </CardHeader>
            <CardContent>
              {friendProfile.careers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  아직 진로 추천을 받지 않았습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friendProfile.careers.map((career) => (
                    <div
                      key={career.id}
                      onClick={() => setSelectedCareer(career)}
                      className="relative bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {career.isConfirmed && (
                        <div className="absolute top-2 right-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        </div>
                      )}
                      <img
                        src={career.image || '/placeholder.svg'}
                        alt={career.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 text-center">{career.name}</h3>
                      {career.isConfirmed && (
                        <p className="text-xs text-yellow-600 text-center mt-1">확정된 진로</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">액션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleShareRecommendations}
                  className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Share2 className="w-4 h-4" />
                  <span>내 추천 결과 공유하기</span>
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>친구 삭제</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Career Detail Popup */}
      <Dialog open={!!selectedCareer} onOpenChange={() => setSelectedCareer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedCareer?.name}</span>
              {selectedCareer?.isConfirmed && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedCareer && (
            <div className="space-y-4">
              <img
                src={selectedCareer.image || '/placeholder.svg'}
                alt={selectedCareer.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">직업 설명</h3>
                <p className="text-gray-600">{selectedCareer.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">전망</h3>
                <p className="text-gray-600">{selectedCareer.outlook}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">로드맵</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {selectedCareer.roadmap.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>친구 삭제</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              정말로 <strong>{friendProfile.name}</strong>님을 친구에서 삭제하시겠습니까?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                취소
              </Button>
              <Button
                onClick={handleDeleteFriend}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                삭제
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
