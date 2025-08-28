//\*\*

//* '진로 탐색 정보'에 대한 데이터 타입입니다.
/* GET /api/recommendation-info (조회 시)
  * PUT /api/recommendation-info (등록/수정 시)
    \*/
export interface RecommendationInfo {
  futureHope: string;
  reasonForHope: string;
  interestsAndHobbies: string;
  mbti: string; // 예: "INFP"
  hollandType: string; // 예: "Social"
  favoriteSubjects: string[]; // 예: ["국어", "과학"]
  workValues: string; // 예: "Stability"
}
