from django.shortcuts import render

# recommend_app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from recommend_app.serializers.user_input import (
    RecommendationRequestSerializer,
    RecommendationResponseSerializer,
)

from recommend_app.services.recommendation import generate_recommendation


class RecommendAPIView(APIView):
    def post(self, request):
        # 1. 요청 데이터 검증
        serializer = RecommendationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 2. 검증된 입력 꺼내기
        input_data = serializer.validated_data

        # 3. 추천 결과 생성 (추천 알고리즘 호출)
        result = generate_recommendation(input_data)

        # 4. 응답 데이터 구성
        response_data = {
            "recommendations": result["recommendations"],  # 직업 리스트
            "gpt_message": result["gpt_message"]            # 자연어 메시지
        }

        # 5. 응답 반환
        return Response(response_data, status=status.HTTP_200_OK)
# Create your views here.
