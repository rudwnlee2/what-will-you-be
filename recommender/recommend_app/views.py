# recommend_app/views.py
from typing import Dict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
import logging

from recommend_app.serializers.user_input import RecommendationRequestSerializer
from recommend_app.services.recommendation import generate_recommendation

logger = logging.getLogger(__name__)

# snake_case 결과가 섞여 들어오는 과거 호환을 위한 매핑(엔진은 camelCase를 반환함)
_SNAKE_TO_CAMEL = {
    "job_name": "jobName",
    "job_sum": "jobSum",
    "job_prospect": "jobProspect",
    "job_environment": "jobEnvironment",
    "job_values": "jobValues",
    # 나머지는 동일 키 사용: way, major, certificate, pay, knowledge, reason
}

def _to_camel_item(item: Dict) -> Dict:
    out: Dict = {}
    for k, v in item.items():
        out[_SNAKE_TO_CAMEL.get(k, k)] = v
    return out


class RecommendAPIView(APIView):
    def post(self, request):
        # 1) 요청 검증
        req = RecommendationRequestSerializer(data=request.data)
        req.is_valid(raise_exception=True)
        input_data: Dict = req.validated_data
        member_id = input_data.get("member_id")  # 추적용/호환용 메타

        try:
            # 2) 추천 생성 (엔진 래퍼 호출)
            result = generate_recommendation(input_data)

            items = result.get("recommendations") or []
            if not items:
                return Response({"error": "추천 결과가 없습니다."},
                                status=status.HTTP_404_NOT_FOUND)

            gpt_msg = result.get("gpt_message", "")

            # 3) 결과 정규화: 만약 snake_case 항목이면 camelCase로 변환
            if isinstance(items, list) and items and "job_name" in items[0]:
                items = [_to_camel_item(it) for it in items]

            # 4) 최종 응답 (자바 연동 편의를 위해 camelCase + meta.memberId 포함)
            payload = {
                "recommendations": items,
                "gpt_message": gpt_msg,
                "meta": {"memberId": member_id}
            }
            return Response(payload, status=status.HTTP_200_OK)

        except ValidationError as ve:
            logger.warning("응답 검증 실패: %s", ve)
            return Response(
                {"error": "응답 형식이 올바르지 않습니다.", "detail": ve.detail},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ValueError as ve:
            logger.warning("추천 결과 값 오류: %s", ve)
            return Response({"error": str(ve)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.exception("추천 API 처리 중 서버 오류")
            return Response({"error": "서버 내부 오류가 발생했습니다."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
