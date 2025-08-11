# recommend_app/utils/response.py
from typing import Any, Dict, List
from rest_framework.exceptions import ValidationError
from recommend_app.serializers.user_input import (
    RecommendationResponseSerializer,
    JobRecommendationSerializer,
)

def _validate_recommendations(raw_recs: Any) -> List[Dict[str, str]]:
    """
    recommendations 항목이 리스트인지 확인하고,
    각 아이템을 JobRecommendationSerializer로 검증/정제한다.
    """
    if raw_recs is None:
        # view에서 404로 처리하도록 빈 리스트 반환
        return []

    if not isinstance(raw_recs, list):
        raise ValueError("recommendations 형식이 올바르지 않습니다. (list 아님)")

    validated: List[Dict[str, str]] = []
    for i, item in enumerate(raw_recs):
        s = JobRecommendationSerializer(data=item)
        try:
            s.is_valid(raise_exception=True)
        except ValidationError as ve:
            # 어떤 인덱스에서 깨졌는지 메시지를 보강
            raise ValidationError({f"recommendations[{i}]": ve.detail})
        validated.append(s.validated_data)
    return validated


def build_recommend_response(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    내부 추천 결과(dict) -> 최종 응답 스키마로 정제 + DRF 검증.
    - result 예시:
      {
        "recommendations": [{"job": "...", "reason": "..."} * 3],
        "gpt_message": "..."
      }
    유효하지 않으면 ValueError/ValidationError 발생.
    """
    if not isinstance(result, dict):
        raise ValueError("내부 추천 결과가 올바르지 않습니다. (dict 아님)")

    # 필수 키 존재 확인
    if "gpt_message" not in result:
        raise ValueError("gpt_message가 누락되었습니다.")

    # recommendations 상세 검증
    recs = _validate_recommendations(result.get("recommendations"))
    data = {
        "recommendations": recs,
        "gpt_message": result.get("gpt_message"),
    }

    # 최종 응답 스키마 검증(필드 타입/필수값 보장)
    s = RecommendationResponseSerializer(data=data)
    s.is_valid(raise_exception=True)
    return s.validated_data
