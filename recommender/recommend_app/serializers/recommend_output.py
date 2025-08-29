from rest_framework import serializers

class JobItemSerializer(serializers.Serializer):
    jobName = serializers.CharField()
    jobSum = serializers.CharField()
    way = serializers.CharField()
    major = serializers.CharField()
    certificate = serializers.CharField()
    pay = serializers.CharField()
    jobProspect = serializers.CharField()
    knowledge = serializers.CharField()
    jobEnvironment = serializers.CharField()
    jobValues = serializers.CharField()
    reason = serializers.CharField()
    member_id = serializers.IntegerField()

class JobListResponseSerializer(serializers.Serializer):
    recommendations = JobItemSerializer(many=True)  # 직업 3개
    gptMessage = serializers.CharField(required=False, allow_blank=True)
