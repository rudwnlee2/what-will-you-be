# recommend_app/services/engine.py

from __future__ import annotations
from typing import List, Dict, Any

from django.conf import settings
from openai import OpenAI
import json
import re

# ─────────────────────────────────────────────────────────────────────
# 책임 1: OpenAI 클라이언트 초기화
# ─────────────────────────────────────────────────────────────────────
if not getattr(settings, "OPENAI_API_KEY", None):
    raise RuntimeError("OPENAI_API_KEY 가 settings.py 에 설정되어 있지 않습니다.")
client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ─────────────────────────────────────────────────────────────────────
# 책임 2: 텍스트 임베딩 생성
# OpenAi에 요청을 보내서 임베딩 후 받아 옴
# ─────────────────────────────────────────────────────────────────────
def get_embedding(text: str, model: str = "text-embedding-3-small") -> List[float]:
    """OpenAI 임베딩 API를 호출하여 벡터를 생성합니다."""
    resp = client.embeddings.create(input=text, model=model)
    return resp.data[0].embedding #여기부분 변수로 담아서 리턴했었는데 바로 리턴으로 바꿈

# ─────────────────────────────────────────────────────────────────────
# 책임 3: GPT 채팅 호출 (내부 유틸리티 함수)
# ─────────────────────────────────────────────────────────────────────
def _chat_once(system_msg: str, user_msg: str, model: str = "gpt-4o-mini", temperature: float = 0.5, max_tokens: int = 150) -> str:
    """GPT 모델에 1회성 요청을 보내고 응답 텍스트를 받습니다."""
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return (resp.choices[0].message.content or "").strip()

# ─────────────────────────────────────────────────────────────────────
# 책임 4: RAG - 추천 이유 생성
# ─────────────────────────────────────────────────────────────────────
def get_recommendation_reason(user_text: str, recommendations: List[Dict[str, Any]]) -> List[str]:
    """각 추천 직업마다 GPT를 통해 1~2문장의 추천 이유를 생성합니다."""
    reasons: List[str] = []
    for rec in recommendations:
        job_name = rec.get("jobName", "")
        job_summary = ", ".join(f"{k}: {v}" for k, v in rec.items() if v)
        system_msg = "너는 직업 추천 전문가야."
        user_msg = (
            f"사용자 설명: {user_text}\n"
            f"추천 직업: {job_name}\n"
            f"직업 요약: {job_summary}\n"
            "이 직업을 추천한 이유를 1~2문장으로 설명해줘."
            " (예시: 창의성과 소통 능력이 요구되며, 다양한 사람들과 협업하는 것을 즐기는 사용자 성향과 일치합니다)"
        )
        reasons.append(_chat_once(system_msg, user_msg))
    return reasons

#이부분은 일단 없애기로 저희 정했었는데 다같이 있을 때 말하고 넘어가려고 남겨놨어요!
def get_overall_reason(user_text: str, recommendations: List[Dict[str, Any]]) -> str:
    """추천된 직업들 전체를 아우르는 종합적인 한 문장 메시지를 생성합니다."""
    job_summary = "; ".join(", ".join(f"{k}: {v}" for k, v in rec.items() if v) for rec in recommendations)
    system_msg = "너는 직업 추천 전문가야."
    user_msg = (
        f"사용자 설명: {user_text}\n"
        f"직업 요약: {job_summary}\n"
        "이 직업 3가지 추천한 이유를 1문장으로 설명해줘."
        " (예시: <직업1>, <직업2>, <직업3>은 당신의 ~한 성향과 잘 어울립니다!)"
    )
    return _chat_once(system_msg, user_msg)

# ─────────────────────────────────────────────────────────────────────
# 책임 5: RAG - 직업 정보를 사용자 입력 내용에 최적화하여 요약
# ─────────────────────────────────────────────────────────────────────
def get_reconstruct_job_info(user_text: str, recommendations: List[Dict[str, Any]], model: str = "gpt-4o-mini",
        temperature: float = 0.7, max_tokens: int = 600) -> List[Dict[str, Any]]:

    reconstructs: List[Dict[str, Any]] = []

    # 직업 한 개씩 요약
    for rec in recommendations:
        rec_json = json.dumps(rec, ensure_ascii=False)

        system_msg = (
            "너는 중학생과 고등학생을 대상으로 일하는 직업 추천 전문가다."
            "항상 JSON만 반환해야 하며, 불필요한 설명은 포함하지 마라."
            "포함해야 하는 키: {jobName, jobSum, way, major, certificate, pay, jobProspect, knowledge, jobEnvironment, jobValues}."
            "jobName은 원본 그대로 두고, 나머지 모든 필드는 사용자의 관심사에 맞게 1~2문장으로 요약하고 재작성해야 한다."
        )
        user_msg = (
            f"사용자 정보: {user_text}\n\n"
            f"추천 직업 정보:\n{rec_json}\n\n"
            "위의 정보를 바탕으로 JSON을 생성하라."
            "말투는 '~합니다.'이나'~습니다.'로 통일하라"
        )

        response = _chat_once(system_msg, user_msg, model, temperature, max_tokens)
        clean_response = extract_json_from_gpt(response)
        if isinstance(clean_response, str):
            try:
                clean_response = json.loads(clean_response)
            except json.JSONDecodeError:
                clean_response = rec  # 실패 시 원본
        reconstructs.append(clean_response)

    return reconstructs

# ─────────────────────────────────────────────────────────────────────
# 책임 5-1: get_reconstruct_job_info() 안에서 gpt 답변 중 json만 추출하는 함수
# ─────────────────────────────────────────────────────────────────────
def extract_json_from_gpt(response: str):
    try:
        # 먼저 응답 전체가 JSON일 경우 바로 파싱
        return json.loads(response)
    except json.JSONDecodeError:
        # 정규식으로 JSON 블록만 추출 (비탐욕 모드)
        match = re.search(r"\{.*?\}|\[.*?\]", response, re.DOTALL)
        if match:
            block = match.group(0)
            try:
                return json.loads(block)
            except json.JSONDecodeError:
                return block  # 파싱 실패 시 문자열 그대로
        return response