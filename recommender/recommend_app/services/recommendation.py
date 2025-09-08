# recommend_app/services/recommendation.py

from __future__ import annotations
from typing import Dict, Any, List

# 역할이 분리된 모듈들을 import
from . import vector_store
from . import engine

# ─────────────────────────────────────────────────────────────────────
# 유틸리티 함수 (원래 vector_store.py에 있던 것을 서비스 레이어로 이동) 함수이름 앞에_만 추가 이미 json형태로 넘어와서 json_to_dict 삭제 -> views.py에서 이미 진행
# ─────────────────────────────────────────────────────────────────────
def _concat_dict_values(d: Dict[str, Any], sep: str = " ") -> str:
    """입력 데이터를 AI 모델이 이해하기 쉬운 하나의 텍스트로 합칩니다."""
    return sep.join(str(v).strip() for v in d.values() if v is not None and str(v).strip() != "")

def _add_reasons_to_recommendations(recommendations: List[Dict[str, Any]], reasons: List[str]) -> List[Dict[str, Any]]:
    """추천 결과에 생성된 이유를 추가합니다."""
    for rec, reason in zip(recommendations, reasons):
        rec["reason"] = reason
    return recommendations

# ─────────────────────────────────────────────────────────────────────
# 서비스 레이어의 메인 함수 (views.py에서 호출)
# ─────────────────────────────────────────────────────────────────────
def generate_recommendation(user_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    사용자 입력을 받아 전체 추천 프로세스를 총괄하고 결과를 반환
    """
    # 1. 사용자 입력을 하나의 텍스트로 변환
    user_text = _concat_dict_values(user_input) #json으로 들어온걸 변환해야함

    # 2. AI 엔진을 통해 텍스트를 벡터로 변환 (임베딩)
    query_vector = engine.get_embedding(user_text)

    # 3. 벡터 저장소에서 데이터 로드 및 유사도 검색
    index, metadata_list = vector_store._load_faiss_index_and_metadata()
    _, indices = vector_store.similarity_search(index, query_vector, k=3) #D, I → _(실제로 값 버림), indices, 이미 similarity_search 함수에서 변환이 되어있음
    
    # 4. 검색 결과를 기반으로 추천 직업 목록 생성
    recommendations = vector_store.build_recommendation_entries(indices, metadata_list)

    if not recommendations:
        return {"recommendations": [], "gpt_message": ""}

    # 5. AI 엔진을 통해 추천 이유 및 요약 메시지 생성 (RAG)
    reasons = engine.get_recommendation_reason(user_text, recommendations)
    recommendations_with_reasons = _add_reasons_to_recommendations(recommendations, reasons)
    gpt_message = engine.get_overall_reason(user_text, recommendations)

    # 6. 최종 결과 조합하여 반환
    return {
        "recommendations": recommendations_with_reasons,
        "gpt_message": gpt_message,
    }
