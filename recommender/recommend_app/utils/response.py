# recommend_app/utils/response.py
from typing import Any, Dict, List
from ..serializers.recommend_output import (
    JobItemSerializer,
    JobListResponseSerializer,
)

def to_camelcase_payload(snake_result: Dict[str, Any], member_id: int) -> Dict[str, Any]:
    """
    snake_case 내부 결과(dict) -> Java가 기대하는 camelCase 직업 객체로 변환
    """
    return {
        "jobName":       snake_result.get("job_name", ""),
        "jobSum":        snake_result.get("job_sum", ""),
        "way":           snake_result.get("way", ""),
        "major":         snake_result.get("major", ""),
        "certificate":   snake_result.get("certificate", ""),
        "pay":           snake_result.get("pay", ""),
        "jobProspect":   snake_result.get("job_prospect", ""),
        "knowledge":     snake_result.get("knowledge", ""),
        "jobEnvironment":snake_result.get("job_environment", ""),
        "jobValues":     snake_result.get("job_values", ""),
        "reason":        snake_result.get("reason", ""),
        "member_id":     member_id,
    }

def build_list_response(snake_items: List[Dict[str, Any]], member_id: int, gpt_message: str = "") -> Dict[str, Any]:
    """
    내부 리스트 결과 -> 최종 응답(bulk)으로 변환 + 스키마 검증
    """
    items = [to_camelcase_payload(item, member_id) for item in (snake_items or [])]

    payload = {
        "recommendations": items,     # 직업 객체 배열 (camelCase)
        "gptMessage": gpt_message or ""
    }

    # 최종 응답 스키마 검증 (타입/필드 보장)
    s = JobListResponseSerializer(data=payload)
    s.is_valid(raise_exception=True)
    return s.validated_data
