from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
import logging

from recommend_app.serializers.user_input import RecommendationRequestSerializer
from recommend_app.services.recommendation import generate_recommendation
from recommend_app.utils.response import build_recommend_response

logger = logging.getLogger(__name__)

class RecommendAPIView(APIView):
    def post(self, request):
        # 1) 요청 검증
        req = RecommendationRequestSerializer(data=request.data)
        req.is_valid(raise_exception=True)
        input_data = req.validated_data

        try:
            # 2) 추천 생성
            result = generate_recommendation(input_data)

            # 3) 추천 없음 처리 → 404
            if not result or not result.get("recommendations"):
                return Response({"error": "추천 결과가 없습니다."},
                                status=status.HTTP_404_NOT_FOUND)

            # 4) 응답 구성 + 형식 검증
            payload = build_recommend_response(result)
            return Response(payload, status=status.HTTP_200_OK)

        except ValidationError as ve:
            # 응답 스키마 검증 실패
            logger.warning("응답 검증 실패: %s", ve)
            return Response({"error": "응답 형식이 올바르지 않습니다.", "detail": ve.detail},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as ve:
            # 내부 데이터 형태 오류
            logger.warning("추천 결과 값 오류: %s", ve)
            return Response({"error": str(ve)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            # 기타 예기치 못한 오류
            logger.exception("추천 API 처리 중 서버 오류")
            return Response({"error": "서버 내부 오류가 발생했습니다."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
