# recommend_app/serializers/user_input.py

from rest_framework import serializers

# 📥 Java → Python: 요청용 Serializer
class RecommendationRequestSerializer(serializers.Serializer):
    dream = serializers.CharField(required=False, allow_blank=True, default="")
    mbti = serializers.CharField(required=False, allow_blank=True, default="")
    interest = serializers.CharField(required=False, allow_blank=True, default="")
    member_id = serializers.IntegerField()  # ✅ Java에서 넘어오는 사용자 ID (필수)
