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
# 책임 4: RAG - 초기 추천 직업 3개를 바탕으로 직업 정보 재구성 + 추천 이유 생성
# get_reconstruct_job_info() + get_recommendation_reason() 기능
# ─────────────────────────────────────────────────────────────────────
def get_reconstruct_job_info_reason(user_text: str, recommendations: List[Dict[str, Any]],
                                    model: str = "gpt-4o-mini",
                                    temperature: float = 0.7,
                                    max_tokens: int = 4000) -> List[Dict[str, Any]]:

    reconstructs = []
    rec_json = json.dumps(recommendations, ensure_ascii=False)

    system_msg = (
        "너는 중고등학생에게 직업을 추천하는 전문가다. "
        "목표: 사용자 정보와 초기 추천 직업을 바탕으로 정확히 3개 직업을 추천한다. "
        "스타일/톤: 쉽고 친근하게, 학생이 이해하기 쉽게 설명한다. "
        "대상: 중학생·고등학생. "
        "응답: 반드시 JSON만 출력한다."
    )

    user_msg = (
        f"사용자 정보: {user_text}\n\n"
        f"초기 추천 직업 목록:\n{rec_json}\n\n"
        "출력 규칙:\n"
        "1. 항상 3개 직업을 추천하고, 초기 목록과 관련 있어야 한다.\n"
        "2. 각 직업은 다음 필드를 포함한다: "
        "jobName, jobSum, way, major, certificate, pay, jobProspect, knowledge, jobEnvironment, jobValues, reason.\n"
        "3. 각 필드는 최소 3문장으로 작성한다.\n"
        "4. 초기 정보가 비어 있으면 관련 정보로 채우고, 첫 문장에 '초기 정보에 없었다'고 밝혀라.\n"
        "5. 추천 결과는 사용자와 잘 맞는 순서대로 정렬한다.\n"
        "6. 아래 예시와 동일한 구조로 출력하라:\n"
        "[\n"
        "  {\n"
        "    \"jobName\": \"예시 직업명\",\n"
        "    \"jobSum\": \"3문장으로 요약된 직업 설명\",\n"
        "    \"way\": \"3문장으로 요약된 되는 길\",\n"
        "    \"major\": \"...\",\n"
        "    \"certificate\": \"...\",\n"
        "    \"pay\": \"...\",\n"
        "    \"jobProspect\": \"...\",\n"
        "    \"knowledge\": \"...\",\n"
        "    \"jobEnvironment\": \"...\",\n"
        "    \"jobValues\": \"...\",\n"
        "    \"reason\": \"3문장으로 요약된 추천 이유\"\n"
        "  }\n"
        "]"
        "7. JSON 문법 오류가 없게 출력한다."
    )

    response = _chat_once(system_msg, user_msg, model, temperature, max_tokens)
    clean_response = extract_json_from_gpt(response)

    # clean_response가 문자열이면 JSON으로 파싱, 아니면 그대로 사용
    if isinstance(clean_response, str):
        try:
            reconstructs = json.loads(clean_response)
        except json.JSONDecodeError:
            print("JSON 파싱 실패, 초기 추천 데이터 반환")
            reconstructs = recommendations
    else:
        reconstructs = clean_response

    return reconstructs

# ─────────────────────────────────────────────────────────────────────
# 책임 4-1: get_reconstruct_job_info() 안에서 gpt 답변 중 json만 추출하는 함수
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