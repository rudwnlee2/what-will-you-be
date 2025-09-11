# recommend_app/serializers/recommend_output.py
# 사용 안함
from rest_framework import serializers

class RecommendedJobDetailSerializer(serializers.Serializer):
    """
    개별 추천 직업의 상세 정보를 정의합니다.
    Java DTO의 RecommendedJobDetail 클래스와 일치합니다.
    """
    jobName = serializers.CharField(source='job_name')
    jobSum = serializers.CharField(source='job_sum')
    way = serializers.CharField(source='way', allow_blank=True, required=False)
    major = serializers.CharField(source='major', allow_blank=True, required=False)
    certificate = serializers.CharField(source='certificate', allow_blank=True, required=False)
    pay = serializers.CharField(source='pay', allow_blank=True, required=False)
    jobProspect = serializers.CharField(source='job_prospect')
    knowledge = serializers.CharField(source='knowledge', allow_blank=True, required=False)
    jobEnvironment = serializers.CharField(source='job_environment')
    jobValues = serializers.CharField(source='job_values')
    reason = serializers.CharField(source='reason', allow_blank=True, required=False) # 추천 이유 필드 추가

class RecommendationResponseSerializer(serializers.Serializer):
    """
    최종 API 응답 구조를 정의합니다.
    Java DTO의 PythonApiResponseDto 클래스와 일치합니다.
    """
    recommendedJobs = RecommendedJobDetailSerializer(many=True, source='recommended_jobs')
    memberId = serializers.IntegerField(source='member_id', allow_null=True)