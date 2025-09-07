# recommender/recommend_app/serializers/user_input.py
from rest_framework import serializers
import re

_MBTI_RE = re.compile(r'^[EI][NS][TF][JP]$', re.IGNORECASE)

class RecommendationRequestSerializer(serializers.Serializer):
    
    # 선택 메타 필드(없어도 OK) - Java camelCase에 맞춤
    # 텍스트 필드(없으면 빈 문자열)
    member_id = serializers.IntegerField(required=False, allow_null=True)
    dream = serializers.CharField(required=False, allow_blank=True, default="")
    interest = serializers.CharField(required=False, allow_blank=True, default="")
    job_value = serializers.CharField(required=False, allow_blank=True, default="")
    mbti = serializers.CharField(required=False, allow_blank=True, default="")
    hobby = serializers.CharField(required=False, allow_blank=True, default="")
    favorite_subject = serializers.CharField(required=False, allow_blank=True, default="")
    holland = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_mbti(self, value: str) -> str:
        v = (value or "").strip()
        if not v:
            return ""  # 미입력 허용
        if not _MBTI_RE.match(v):
            raise serializers.ValidationError("MBTI 형식이 올바르지 않습니다. 예) INTJ")
        return v.upper()
    
    def to_internal_value(self, data):
        iv = super().to_internal_value(data)
        # 모든 키를 serializer에 정의된 필드명(snake_case)과 일치
        for k in ("dream", "mbti", "interest", "job_value", "hobby", "favorite_subject", "holland"):
            iv[k] = (iv.get(k) or "").strip()
        return iv
