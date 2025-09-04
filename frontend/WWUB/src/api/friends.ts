// export interface Friend {
//   id: string;
//   name: string;
//   isOnline: boolean;
//   avatar?: string;
// }

// export interface FriendRequest {
//   id: string;
//   name: string;
//   avatar?: string;
//   type: 'sent' | 'received';
// }

// export interface FriendCareer {
//   id: string;
//   name: string;
//   image: string;
//   isConfirmed: boolean;
//   description: string;
//   outlook: string;
//   roadmap: string[];
// }

// export interface FriendProfile {
//   id: string;
//   name: string;
//   isOnline: boolean;
//   avatar?: string;
//   school?: string;
//   status?: string;
//   careers: FriendCareer[];
// }

// // Mock data for demonstration
// const mockFriends: Friend[] = [
//   { id: '1', name: 'kimjihoon', isOnline: true },
//   { id: '2', name: 'parkminsu', isOnline: false },
//   { id: '3', name: 'leesoyoung', isOnline: true },
//   { id: '4', name: 'choihyunwoo', isOnline: false },
// ];

// const mockFriendRequests: FriendRequest[] = [
//   { id: '1', name: 'jangseoyeon', type: 'received' },
//   { id: '2', name: 'kimtaehyung', type: 'received' },
// ];

// const mockFriendCareers: Record<string, FriendCareer[]> = {
//   '1': [
//     {
//       id: '1',
//       name: '소프트웨어 개발자',
//       image: '/software-developer-workspace.png',
//       isConfirmed: true,
//       description: '창의적인 문제 해결과 기술 혁신을 통해 디지털 세상을 만들어가는 직업',
//       outlook: '높은 성장성과 안정적인 취업 전망',
//       roadmap: ['프로그래밍 언어 학습', '프로젝트 경험 쌓기', '포트폴리오 구축', '기업 지원'],
//     },
//     {
//       id: '2',
//       name: '데이터 분석가',
//       image: '/data-analyst-workspace.png',
//       isConfirmed: false,
//       description: '데이터를 통해 인사이트를 발견하고 비즈니스 의사결정을 지원하는 직업',
//       outlook: '빅데이터 시대에 필수적인 역할로 수요 증가',
//       roadmap: ['통계학 기초', '데이터 분석 도구 학습', '실무 프로젝트', '자격증 취득'],
//     },
//   ],
//   '2': [
//     {
//       id: '3',
//       name: '마케팅 전문가',
//       image: '/marketing-specialist.png',
//       isConfirmed: true,
//       description: '브랜드와 소비자를 연결하는 창의적인 커뮤니케이션 전문가',
//       outlook: '디지털 마케팅 분야의 지속적인 성장',
//       roadmap: ['마케팅 이론 학습', '디지털 도구 활용', '캠페인 기획', '성과 분석'],
//     },
//   ],
// };

// export function getFriends(): Friend[] {
//   const stored = localStorage.getItem('friends');
//   if (stored) {
//     return JSON.parse(stored);
//   }
//   localStorage.setItem('friends', JSON.stringify(mockFriends));
//   return mockFriends;
// }

// export function getFriendRequests(): FriendRequest[] {
//   const stored = localStorage.getItem('friendRequests');
//   if (stored) {
//     return JSON.parse(stored);
//   }
//   localStorage.setItem('friendRequests', JSON.stringify(mockFriendRequests));
//   return mockFriendRequests;
// }

// export function searchUsers(query: string): Friend[] {
//   if (!query.trim()) return [];

//   // Mock search results
//   const mockResults: Friend[] = [
//     { id: 'search1', name: 'newuser123', isOnline: true },
//     { id: 'search2', name: 'testuser456', isOnline: false },
//   ];

//   return mockResults.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
// }

// export function addFriend(userId: string, userName: string) {
//   const requests = getFriendRequests();
//   const newRequest: FriendRequest = {
//     id: userId,
//     name: userName,
//     type: 'sent',
//   };

//   const updatedRequests = [...requests, newRequest];
//   localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
// }

// export function acceptFriendRequest(requestId: string, userName: string) {
//   const friends = getFriends();
//   const requests = getFriendRequests();

//   const newFriend: Friend = {
//     id: requestId,
//     name: userName,
//     isOnline: Math.random() > 0.5,
//   };

//   const updatedFriends = [...friends, newFriend];
//   const updatedRequests = requests.filter((req) => req.id !== requestId);

//   localStorage.setItem('friends', JSON.stringify(updatedFriends));
//   localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
// }

// export function rejectFriendRequest(requestId: string) {
//   const requests = getFriendRequests();
//   const updatedRequests = requests.filter((req) => req.id !== requestId);
//   localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
// }

// export function removeFriend(friendId: string) {
//   const friends = getFriends();
//   const updatedFriends = friends.filter((friend) => friend.id !== friendId);
//   localStorage.setItem('friends', JSON.stringify(updatedFriends));
// }

// export function getFriendProfile(friendId: string): FriendProfile | null {
//   const friends = getFriends();
//   const friend = friends.find((f) => f.id === friendId);

//   if (!friend) return null;

//   return {
//     ...friend,
//     school: '서울대학교',
//     status: '진로 탐색 중',
//     careers: mockFriendCareers[friendId] || [],
//   };
// }

// export function removeFriendById(friendId: string): boolean {
//   const friends = getFriends();
//   const updatedFriends = friends.filter((friend) => friend.id !== friendId);

//   if (updatedFriends.length === friends.length) {
//     return false; // Friend not found
//   }

//   localStorage.setItem('friends', JSON.stringify(updatedFriends));
//   return true;
// }

// export function shareRecommendations(friendId: string): boolean {
//   // Mock implementation - in real app would send to backend
//   console.log(`Sharing recommendations with friend ${friendId}`);
//   return true;
// }
