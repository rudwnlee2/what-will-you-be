# recommend_app/views.py
from typing import Dict
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.http import JsonResponse
import logging

from .serializers.user_input import RecommendationRequestSerializer
from .serializers.recommend_output import RecommendationResponseSerializer
from .services.recommendation import generate_recommendation

logger = logging.getLogger(__name__)

_SNAKE_TO_CAMEL = {
    "job_name": "jobName",
    "job_sum": "jobSum",
    "job_prospect": "jobProspect",
    "job_environment": "jobEnvironment",
    "job_values": "jobValues",
}

def _to_camel_item(item: Dict) -> Dict:
    return { _SNAKE_TO_CAMEL.get(k, k): v for k, v in item.items() }

class RecommendAPIView(APIView):
    def post(self, request):
        try:
            # # 요청 데이터 로그 출력
            # print(f"📝 수신 데이터: {request.data}")
            # print(f"📝 Content-Type: {request.content_type}")
            
            # 1) 입력 검증
            req = RecommendationRequestSerializer(data=request.data)
            req.is_valid(raise_exception=True)
            # views.py의 post 메소드 안
            input_data: Dict = req.validated_data
            # validated_data에는 "member_id" (snake_case) 키만 존재합니다.
            member_id = input_data.get("member_id")
            
            print(f"✅ 검증된 데이터: {input_data}")

            # 2) 추천 생성
            result = generate_recommendation(input_data)

            # 3) 결과 정규화
            items = result.get("recommendations") or []
            if isinstance(items, list) and items and "job_name" in items[0]:
                items = [_to_camel_item(it) for it in items]
            gpt_msg = result.get("gpt_message") or result.get("gptMessage") or ""

            if not items:
                return Response({"error": "추천 결과가 없습니다."}, status=status.HTTP_404_NOT_FOUND)

            # 4) 응답 - 디버깅용 로그 추가
            payload = {
                "recommendedJobs": items,   # Java가 기대하는 필드명
                "memberId": member_id,      # Java DTO 구조에 맞춤
            }
            
            # print(f"📤 전송 데이터: {payload}")
            # print(f"📤 전송 Content-Type: application/json")

            return Response(payload, status=status.HTTP_200_OK)

        except ValidationError as ve:
            logger.warning("요청 유효성 오류: %s", ve)
            return Response({"error": "요청 형식 오류", "detail": ve.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # 개발 중에는 에러 내용을 그대로 노출해 원인 파악
            logger.exception("추천 API 처리 중 예외")
            if settings.DEBUG:
                return Response(
                    {"error": f"{e.__class__.__name__}: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            return Response({"error": "서버 내부 오류가 발생했습니다."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
