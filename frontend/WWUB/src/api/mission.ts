// export type Mission = {
//   id: string;
//   careerId: string;
//   careerName: string;
//   title: string;
//   content: string;
//   status: 'progress' | 'completed';
//   createdAt: string;
//   completedAt?: string;
// };

// export type FriendMission = {
//   id: string;
//   careerId: string;
//   careerName: string;
//   title: string;
//   content: string;
//   status: 'progress' | 'completed';
//   createdAt: string;
//   completedAt?: string;
//   friendId: string;
//   friendName: string;
//   type: 'friend';
// };

// export type IndividualMission = Mission & {
//   type: 'individual';
// };

// export type AllMissionTypes = IndividualMission | FriendMission;

// export function getMissions(): IndividualMission[] {
//   if (typeof window === 'undefined') return [];
//   const stored = localStorage.getItem('userMissions');
//   return stored ? JSON.parse(stored).map((m) => ({ ...m, type: 'individual' })) : [];
// }

// export function saveMissions(missions: IndividualMission[]): void {
//   if (typeof window === 'undefined') return;
//   localStorage.setItem(
//     'userMissions',
//     JSON.stringify(missions.map((m) => ({ ...m, type: undefined }))),
//   );
// }

// export function addMission(
//   mission: Omit<IndividualMission, 'id' | 'createdAt' | 'type'>,
// ): IndividualMission {
//   const newMission: IndividualMission = {
//     ...mission,
//     id: Date.now().toString(),
//     createdAt: new Date().toISOString(),
//     status: 'progress',
//     type: 'individual',
//   };

//   const missions = getMissions();
//   missions.push(newMission);
//   saveMissions(missions);
//   return newMission;
// }

// export function updateMissionStatus(missionId: string, status: 'progress' | 'completed'): void {
//   const missions = getMissions();
//   const mission = missions.find((m) => m.id === missionId);
//   if (mission) {
//     mission.status = status;
//     if (status === 'completed') {
//       mission.completedAt = new Date().toISOString();
//     } else {
//       delete mission.completedAt;
//     }
//     saveMissions(missions);
//   }
// }

// export function deleteMission(missionId: string): void {
//   const missions = getMissions();
//   const filtered = missions.filter((m) => m.id !== missionId);
//   saveMissions(filtered);
// }

// export function hasActiveMissionForCareer(careerId: string): boolean {
//   const missions = getMissions();
//   return missions.some((m) => m.careerId === careerId && m.status === 'progress');
// }

// export function getMissionsByCareer(careerId: string): IndividualMission[] {
//   const missions = getMissions();
//   return missions.filter((m) => m.careerId === careerId);
// }

// export function getFriendMissions(): FriendMission[] {
//   if (typeof window === 'undefined') return [];
//   const stored = localStorage.getItem('userFriendMissions');
//   return stored ? JSON.parse(stored) : [];
// }

// export function saveFriendMissions(missions: FriendMission[]): void {
//   if (typeof window === 'undefined') return;
//   localStorage.setItem('userFriendMissions', JSON.stringify(missions));
// }

// export function addFriendMission(
//   mission: Omit<FriendMission, 'id' | 'createdAt' | 'type'>,
// ): FriendMission {
//   const newMission: FriendMission = {
//     ...mission,
//     id: Date.now().toString(),
//     createdAt: new Date().toISOString(),
//     status: 'progress',
//     type: 'friend',
//   };

//   const missions = getFriendMissions();
//   missions.push(newMission);
//   saveFriendMissions(missions);
//   return newMission;
// }

// export function updateFriendMissionStatus(
//   missionId: string,
//   status: 'progress' | 'completed',
// ): void {
//   const missions = getFriendMissions();
//   const mission = missions.find((m) => m.id === missionId);
//   if (mission) {
//     mission.status = status;
//     if (status === 'completed') {
//       mission.completedAt = new Date().toISOString();
//     } else {
//       delete mission.completedAt;
//     }
//     saveFriendMissions(missions);
//   }
// }

// export function deleteFriendMission(missionId: string): void {
//   const missions = getFriendMissions();
//   const filtered = missions.filter((m) => m.id !== missionId);
//   saveFriendMissions(filtered);
// }

// export function getAllMissionsWithType(): AllMissionTypes[] {
//   const individual: IndividualMission[] = getMissions();
//   const friend: FriendMission[] = getFriendMissions();
//   return [...individual, ...friend].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//   );
// }
