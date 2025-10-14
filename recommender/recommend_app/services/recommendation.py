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

# ─────────────────────────────────────────────────────────────────────
# 서비스 레이어의 메인 함수 (views.py에서 호출)
# 사용자 입력을 받아 전체 추천 프로세스를 총괄하고 결과를 반환
# ─────────────────────────────────────────────────────────────────────
def generate_recommendation(user_input: Dict[str, Any]) -> Dict[str, Any]:

    # 1. 사용자 입력을 하나의 텍스트로 변환
    user_text = _concat_dict_values(user_input) #json으로 들어온걸 변환해야함

    # 2. AI 엔진을 통해 텍스트를 벡터로 변환 (임베딩)
    query_vector = engine.get_embedding(user_text)

    # 3. 벡터 저장소에서 데이터 로드 및 유사도 검색
    index, metadata_list, chunks_meta = vector_store._load_faiss_index_and_metadata()
    selected_job_ids, indices = vector_store.similarity_search(index, query_vector, chunks_meta, top_jobs=3)
    
    # 4. 검색 결과를 기반으로 추천 직업 목록 생성
    recommendations = vector_store.build_job_metadata(selected_job_ids, chunks_meta, metadata_list)

    if not recommendations:
        return {"recommendations": []}

    # 4-1. '해당 사항 없음' 필드를 웹 검색 api 기능 사용하여 채우기
    for i, rec in enumerate(recommendations):
        recommendations[i] = engine.fill_missing_with_web_search(rec)

    # 5. AI 엔진을 통해 추천 이유 및 요약 메시지 생성 (RAG)
    recommendations_with_reasons = engine.get_reconstruct_job_info_reason(user_text, recommendations)

    # 6. 최종 결과 조합하여 반환
    return {
        "recommendations": recommendations_with_reasons
    }
