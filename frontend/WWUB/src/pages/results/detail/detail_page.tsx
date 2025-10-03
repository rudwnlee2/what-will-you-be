import { useParams, useNavigate } from 'react-router-dom';
import {
  useJobRecommendation,
  useJobRecommendationDetail,
} from '../../../hooks/useJobRecommendation'; // ❗ 상세 조회 훅 사용 ❗ useJobRecommendation 훅 추가 import
import { useQueryClient } from '@tanstack/react-query'; // ❗ queryClient 훅 import

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react'; // 로딩 스피너 Trash2 아이콘 import

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'; // ❗ 확인 팝업 컴포넌트 import

export default function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ❗ queryClient 인스턴스 가져오기
  // ❗ URL의 id를 숫자로 변환하여 훅에 전달
  const recommendationId = id ? parseInt(id, 10) : null;
  const { data: career, isLoading, error } = useJobRecommendationDetail(recommendationId);
  const { delete: deleteRecommendation, isDeleting } = useJobRecommendation(); // ❗ 삭제 함수와 로딩 상태 가져오기

  // ❗ 삭제 확인 및 실행 함수
  const handleDelete = () => {
    if (!recommendationId) return;

    deleteRecommendation(recommendationId, {
      onSuccess: () => {
        alert('추천 기록이 삭제되었습니다.');
        // history 페이지의 데이터를 최신화하도록 쿼리를 무효화합니다.
        queryClient.invalidateQueries({ queryKey: ['jobRecommendations'] });
        // 삭제 후에는 목록(history) 페이지로 이동합니다.
        navigate('/history');
      },
      onError: (err: Error) => {
        alert(`삭제 중 오류가 발생했습니다: ${err.message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="text-center pt-40">
        <p>추천 정보를 불러오는 데 실패했습니다.</p>
        <Button onClick={() => navigate('/history')}>목록으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white rounded-xl shadow p-6 sm:p-8">
          <h2 className="text-3xl font-bold mb-2">{career.jobName}</h2>
          <p className="text-sm text-gray-500 mb-6">
            추천일: {new Date(career.recommendedAt).toLocaleDateString()}
          </p>

          <div className="space-y-4 text-gray-800">
            <InfoSection title="직업 요약" content={career.jobSummary} />
            <InfoSection title="추천 이유" content={career.reason} />
            <InfoSection title="관련 전공" content={career.relatedMajors} />
            <InfoSection title="관련 자격증" content={career.relatedCertificates} />
            <InfoSection title="평균 임금" content={career.salary} />
            <InfoSection title="직업 전망" content={career.prospect} />
            <InfoSection title="필요 지식" content={career.requiredKnowledge} />
            <InfoSection title="경력 경로" content={career.careerPath} />
            <InfoSection title="근무 환경" content={career.environment} />
            <InfoSection title="어울리는 가치관" content={career.jobValues} />
          </div>

          {/* 2. 중복된 버튼 영역을 하나로 통합했습니다. */}
          <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={() => navigate('/history')} variant="outline">
              목록으로 돌아가기
            </Button>
            {/* 삭제 확인 팝업을 여는 버튼 */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />이 추천 기록 삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 추천 기록은 영구적으로 삭제되며, 복구할 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </main>
    </div>
  );
}

// 정보 섹션을 위한 작은 컴포넌트
function InfoSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-1 mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}
// type Career = {
//   id: string;
//   name: string;
//   image: string;
//   reason: string;
//   role: string;
//   howTo: string;
//   majors: string[];
//   certificates: string[];
//   salary: string;
//   outlook: string;
//   knowledge: string[];
//   environment: string;
//   values: string[];
//   satisfaction: string;
//   labor: string;
//   skills: string[];
// };

// export default function ResultDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [careers, setCareers] = useState<Career[]>([]);
//   const [current, setCurrent] = useState<Career | null>(null);
//   const { user } = useAuth();
//   const guarded = useRef(false);

//   useEffect(() => {
//     const raw = sessionStorage.getItem('recommendationResult');
//     if (!raw) {
//       if (!guarded.current) {
//         guarded.current = true;
//         navigate('/results');
//       }
//       return;
//     }
//     try {
//       const data = JSON.parse(raw);
//       const list: Career[] = data.careers || [];
//       setCareers(list);
//       const found = list.find((c) => c.id === id) || list[0] || null;
//       setCurrent(found);
//     } catch {
//       if (!guarded.current) {
//         guarded.current = true;
//         navigate('/results');
//       }
//     }
//   }, [id]);

//   const otherCareers = useMemo(
//     () => careers.filter((c) => c.id !== current?.id),
//     [careers, current],
//   );

//   if (!current) return null;

//   return (
//     <div className="min-h-screen bg-purple-50">
//       <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16" />
//       <h1 className="text-3xl font-bold text-gray-900 mb-2">당신에게 추천하는 직업</h1>
//       <p className="text-gray-600 mb-8">왼쪽 목록에서 다른 직업을 선택해 상세 정보를 확인하세요.</p>

//       <div className="grid md:grid-cols-[260px_1fr] gap-6">
//         {/* Left: other careers */}
//         <aside className="space-y-3">
//           {otherCareers.map((c) => (
//             <button
//               key={c.id}
//               onClick={() => setCurrent(c)}
//               className="w-full bg-white rounded-lg shadow hover:shadow-md transition p-3 text-left"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="relative w-16 h-12 rounded overflow-hidden">
//                   <img
//                     src={c.image || '/placeholder.svg'}
//                     alt={c.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="text-sm font-semibold text-gray-900">{c.name}</div>
//               </div>
//             </button>
//           ))}
//         </aside>
//       </div>
//       {/* Right: main detail */}
//       <section>
//         <Card className="bg-white rounded-xl shadow p-6 sm:p-8 relative">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="relative w-full h-64 rounded-lg overflow-hidden">
//               <img
//                 src={current.image || '/placeholder.svg'}
//                 alt={current.name}
//                 className="w-full h-full object-cover"
//               />
//               {user?.name && (
//                 <div className="absolute bottom-0 right-0 p-2">
//                   <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
//                     {user.name.charAt(0)}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold mb-2">{current.name}</h2>
//               <p className="text-gray-600 mb-4">{current.reason}</p>
//               <div className="space-y-2 text-gray-800 text-sm">
//                 <p>
//                   <b>추천 이유:</b> {current.reason}
//                 </p>
//                 <p>
//                   <b>직업이 하는 일:</b> {current.role}
//                 </p>
//                 <p>
//                   <b>직업이 되는 법:</b> {current.howTo}
//                 </p>
//                 <p>
//                   <b>관련 전공 리스트:</b> {current.majors.join(', ')}
//                 </p>
//                 <p>
//                   <b>관련 자격증:</b> {current.certificates.join(', ')}
//                 </p>
//                 <p>
//                   <b>임금 정보:</b> {current.salary}
//                 </p>
//                 <p>
//                   <b>직업 전망:</b> {current.outlook}
//                 </p>
//                 <p>
//                   <b>필요 지식 영역:</b> {current.knowledge.join(', ')}
//                 </p>
//                 <p>
//                   <b>근무 환경:</b> {current.environment}
//                 </p>
//                 <p>
//                   <b>직업 가치관:</b> {current.values.join(', ')}
//                 </p>
//                 <p>
//                   <b>직업 만족도:</b> {current.satisfaction}
//                 </p>
//                 <p>
//                   <b>일자리 현황:</b> {current.labor}
//                 </p>
//                 <p>
//                   <b>업무 수행 능력:</b> {current.skills.join(', ')}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 border-t pt-6">
//             <div className="text-center">
//               <Button
//                 onClick={() => navigate('/results')}
//                 className="bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 다른 추천 결과 보기
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </section>
//     </div>
//   );
// }
//           {/* </div> && !currentMission && (
//               <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
//                 <AlertCircle className="w-4 h-4" />
//                 <span className="text-sm">미션을 완료한 후 다시 시도해 주세요.</span>
//               </div>
//             ) */}

//             {/* {currentMission ? (
//               <Card className="bg-gray-50 p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <h4 className="font-semibold text-lg">{currentMission.title}</h4>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       currentMission.status === 'completed'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-blue-100 text-blue-800'
//                     }`}
//                   >
//                     {currentMission.status === 'completed' ? '완료' : '진행 중'}
//                   </span>
//                 </div>
//                 <p className="text-gray-700 mb-4">{currentMission.content}</p>
//                 <div className="text-sm text-gray-500 mb-4">
//                   생성일: {new Date(currentMission.createdAt).toLocaleDateString()}
//                   {currentMission.completedAt && (
//                     <span className="ml-4">
//                       완료일: {new Date(currentMission.completedAt).toLocaleDateString()}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   {currentMission.status === 'progress' && (
//                     <Button
//                       onClick={completeMission}
//                       size="sm"
//                       className="bg-green-600 hover:bg-green-700"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-1" />
//                       완료
//                     </Button>
//                   )}
//                   <Button
//                     onClick={() => setShowDeleteConfirm(true)}
//                     size="sm"
//                     variant="destructive"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     삭제
//                   </Button>
//                 </div>
//               </Card>
//             ) : (
//               !hasActiveMissionForCareer(current.id) && (
//                 <p className="text-gray-500 text-sm">아직 생성된 미션이 없습니다.</p>
//               )
//             )} */}
//           {/* <div>
//         </Card>
//       </section>
//     </div> */}

//     {/* {showDeleteConfirm && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <Card className="bg-white p-6 max-w-sm mx-4">
//           <h3 className="text-lg font-semibold mb-4">미션 삭제</h3>
//           <p className="text-gray-600 mb-6">정말로 이 미션을 삭제하시겠습니까?</p>
//           <div className="flex gap-3 justify-end">
//             <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
//               아니오
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteMission}>
//               예
//             </Button>
//           </div>
//         </Card>
//       </div>
//     )} */}
//   {/* </main> */}
// {/* </div> */}
