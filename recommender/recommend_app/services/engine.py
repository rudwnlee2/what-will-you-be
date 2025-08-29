# recommend_app/services/engine.py
from typing import Dict, List
from . import vector_store as vs
from . import embedding as emb

# 필요 시 모델명 한 곳에서 관리
EMBED_MODEL = "text-embedding-3-small"
TOP_K = 3

def _concat_user_text(user: Dict) -> str:
    # vector_store에도 concat_dict_values가 있지만, user가 dict라는 보장을 위해 여기서 한 번 처리
    vals = []
    for k in ("dream", "mbti", "interest", "interests", "member_id", "age"):
        v = user.get(k)
        if v is None: 
            continue
        vals.append(" ".join(v) if isinstance(v, list) else str(v))
    return " ".join(vals) if vals else "진로 추천"

def recommend(user: Dict) -> Dict:
    """
    입력: {'dream':..., 'mbti':..., 'interest' or 'interests':..., 'member_id':...}
    출력: {'recommendations': [ {...} x3 ], 'gpt_message': '...' }
    """
    # 1) 인덱스/메타 로드
    index, metadata_list = vs.load_faiss_index_and_metadata()

    # 2) 쿼리 텍스트 & 임베딩
    user_text = _concat_user_text(user)
    try:
        # B의 embedding.py를 우선 사용
        q_vec = emb.get_embedding(user_text, model=EMBED_MODEL)
    except Exception:
        # (혹시 vector_store에 것만 남아있을 때 대비)
        q_vec = vs.get_embedding(user_text, model=EMBED_MODEL)

    # 3) 유사도 검색
    D, I = vs.similarity_search(index, q_vec, k=TOP_K)

    # 4) 메타데이터로 추천 항목 구성 (camelCase로 반환됨)
    recommendations = vs.build_recommendation_entries(I, metadata_list)

    # 5) 추천 이유 생성(항목별 1~2문장)
    reasons = vs.get_recommendation_reason(user_text, recommendations)
    recommendations = vs.add_reasons_to_recommendations(recommendations, reasons)

    # 6) 요약 메시지 생성(간단 버전)
    job_names = ", ".join(r.get("jobName", "") for r in recommendations)
    gpt_message = f"입력하신 정보에 기반해 {job_names} 등을 추천합니다."

    return {"recommendations": recommendations, "gpt_message": gpt_message}
