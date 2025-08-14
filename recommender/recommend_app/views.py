# recommend_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
import logging

from recommend_app.serializers.user_input import RecommendationRequestSerializer
from recommend_app.services.recommendation import generate_recommendation
from recommend_app.utils.response import build_list_response  # ✅ 변경: 새 유틸

logger = logging.getLogger(__name__)

class RecommendAPIView(APIView):
    def post(self, request):
        # 1) 요청 검증
        req = RecommendationRequestSerializer(data=request.data)
        req.is_valid(raise_exception=True)
        input_data = req.validated_data
        member_id = input_data["member_id"]  # ✅ 추가: FK 전달용

        try:
            # 2) 추천 생성 (snake_case 리스트 + gpt_message)
            result = generate_recommendation(input_data)

            items = result.get("recommendations") or []
            if not items:
                return Response({"error": "추천 결과가 없습니다."},
                                status=status.HTTP_404_NOT_FOUND)

            gpt_msg = result.get("gpt_message", "")

            # 3) 응답 구성 + 형식 검증 (camelCase 변환 포함)
            payload = build_list_response(items, member_id, gpt_msg)  # ✅ 핵심 변경
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
