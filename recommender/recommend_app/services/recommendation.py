# recommender/recommend_app/services/recommendation.py
from __future__ import annotations
from typing import Dict, Any

# 상대 임포트로 동일 폴더(services) 모듈 불러오기
from . import vector_store as vs
# (선택) GPT 직접 호출이 필요하면 사용
# from .engine import ask_gpt


def generate_recommendation(user_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    vector_store.get_recommend()를 호출해 결과를 표준 형태로 반환.
    반환 스키마(뷰에서 기대):
      {
        "recommendations": [ { jobName, jobSum, ..., reason }, ... ],
        "gpt_message": "..."   # 또는 gptMessage로 들어오면 통일해서 gpt_message로 리턴
      }
    """
    result = vs.get_recommend(user_input)

    # 키 정규화: gpt_message / gptMessage 섞여 들어올 수 있음
    recs = result.get("recommendations") or []
    gpt_msg = result.get("gpt_message") or result.get("gptMessage") or ""

    return {
        "recommendations": recs,
        "gpt_message": gpt_msg,
    }
