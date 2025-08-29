# recommender/recommend_app/serializers/user_input.py
from rest_framework import serializers
import re

_MBTI_RE = re.compile(r'^[EI][NS][TF][JP]$', re.IGNORECASE)

class RecommendationRequestSerializer(serializers.Serializer):
    # 선택 메타 필드(없어도 OK)
    member_id = serializers.IntegerField(required=False, allow_null=True)

    # 텍스트 필드(없으면 빈 문자열)
    dream    = serializers.CharField(required=False, allow_blank=True, default="")
    mbti     = serializers.CharField(required=False, allow_blank=True, default="")
    interest = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_mbti(self, value: str) -> str:
        v = (value or "").strip()
        if not v:
            return ""  # 미입력 허용
        if not _MBTI_RE.match(v):
            raise serializers.ValidationError("MBTI 형식이 올바르지 않습니다. 예) INTJ")
        return v.upper()

    def to_internal_value(self, data):
        iv = super().to_internal_value(data)
        # 공백 제거
        for k in ("dream", "mbti", "interest"):
            iv[k] = (iv.get(k) or "").strip()
        return iv
