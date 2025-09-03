# recommend_app/services/engine.py

# recommend_app/services/engine.py

from __future__ import annotations
from typing import List, Dict, Any

from django.conf import settings
from openai import OpenAI

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

# from typing import Dict, List
# from . import vector_store as vs
# from . import embedding as emb

# # 필요 시 모델명 한 곳에서 관리
# EMBED_MODEL = "text-embedding-3-small"
# TOP_K = 3

# def _concat_user_text(user: Dict) -> str:
#     # vector_store에도 concat_dict_values가 있지만, user가 dict라는 보장을 위해 여기서 한 번 처리
#     vals = []
#     for k in ("dream", "mbti", "interest", "interests", "member_id", "age"):
#         v = user.get(k)
#         if v is None: 
#             continue
#         vals.append(" ".join(v) if isinstance(v, list) else str(v))
#     return " ".join(vals) if vals else "진로 추천"

# def recommend(user: Dict) -> Dict:
#     """
#     입력: {'dream':..., 'mbti':..., 'interest' or 'interests':..., 'member_id':...}
#     출력: {'recommendations': [ {...} x3 ], 'gpt_message': '...' }
#     """
#     # 1) 인덱스/메타 로드
#     index, metadata_list = vs.load_faiss_index_and_metadata()

#     # 2) 쿼리 텍스트 & 임베딩
#     user_text = _concat_user_text(user)
#     try:
#         # B의 embedding.py를 우선 사용
#         q_vec = emb.get_embedding(user_text, model=EMBED_MODEL)
#     except Exception:
#         # (혹시 vector_store에 것만 남아있을 때 대비)
#         q_vec = vs.get_embedding(user_text, model=EMBED_MODEL)

#     # 3) 유사도 검색
#     D, I = vs.similarity_search(index, q_vec, k=TOP_K)

#     # 4) 메타데이터로 추천 항목 구성 (camelCase로 반환됨)
#     recommendations = vs.build_recommendation_entries(I, metadata_list)

#     # 5) 추천 이유 생성(항목별 1~2문장)
#     reasons = vs.get_recommendation_reason(user_text, recommendations)
#     recommendations = vs.add_reasons_to_recommendations(recommendations, reasons)

#     # 6) 요약 메시지 생성(간단 버전)
#     job_names = ", ".join(r.get("jobName", "") for r in recommendations)
#     gpt_message = f"입력하신 정보에 기반해 {job_names} 등을 추천합니다."

#     return {"recommendations": recommendations, "gpt_message": gpt_message}
