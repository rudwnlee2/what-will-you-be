# recommend_app/serializers/user_input.py

from rest_framework import serializers

# 📥 Java → Python: 요청용 Serializer
class RecommendationRequestSerializer(serializers.Serializer):
    dream = serializers.CharField()
    mbti = serializers.CharField()
    interest = serializers.CharField()

# 📤 Python → Java: 응답용 Serializer
class JobRecommendationSerializer(serializers.Serializer):
    job = serializers.CharField()
    reason = serializers.CharField()

class RecommendationResponseSerializer(serializers.Serializer):
    recommendations = JobRecommendationSerializer(many=True)
    gpt_message = serializers.CharField()
