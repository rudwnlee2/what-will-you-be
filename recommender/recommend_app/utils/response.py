# recommend_app/utils/response.py
from typing import Any, Dict, List

# 이번 버전은 별도의 Serializer 검증 없이, snake/camel 혼재 입력을 받아
# camelCase로 표준화해서 payload를 만들어 줍니다.

_SNAKE_TO_CAMEL = {
    "job_name": "jobName",
    "job_sum": "jobSum",
    "job_prospect": "jobProspect",
    "job_environment": "jobEnvironment",
    "job_values": "jobValues",
    # 동일 키: way, major, certificate, pay, knowledge, reason
}

def _to_camel_item(item: Dict[str, Any]) -> Dict[str, Any]:
    """추천 항목을 camelCase로 정규화 (이미 camel이면 그대로 통과)"""
    if "jobName" in item:
        return item  # 이미 camelCase 결과(엔진)라면 그대로
    out: Dict[str, Any] = {}
    for k, v in item.items():
        out[_SNAKE_TO_CAMEL.get(k, k)] = v
    return out

def build_list_response(items: List[Dict[str, Any]],
                        member_id: int | None = None,
                        gpt_message: str = "") -> Dict[str, Any]:
    """추천 리스트를 camelCase + meta로 묶어 최종 응답 생성"""
    camel_items = [_to_camel_item(it) for it in (items or [])]
    payload: Dict[str, Any] = {
        "recommendations": camel_items,     # 직업 객체 배열 (camelCase)
        "gpt_message": gpt_message or "",
    }
    if member_id is not None:
        payload["meta"] = {"memberId": member_id}
    return payload
