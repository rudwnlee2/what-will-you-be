# recommender/recommend_app/vector_store.py

# 필요 import 파일 모음
from __future__ import annotations

import os
import json
from pathlib import Path
from typing import List, Tuple, Dict, Any

import faiss
import numpy as np
from django.conf import settings
# from openai import OpenAI

# # ─────────────────────────────────────────────────────────────────────
# # OpenAI 클라이언트 (settings의 하드코딩 키 사용)
# # ─────────────────────────────────────────────────────────────────────
# if not getattr(settings, "OPENAI_API_KEY", None):
#     raise RuntimeError("OPENAI_API_KEY 가 settings.py 에 설정되어 있지 않습니다.")
# client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ─────────────────────────────────────────────────────────────────────
# 경로 설정 (절대 경로, Django BASE_DIR 기준)
#   BASE_DIR = <project>/recommender
#   data 폴더: <project>/recommender/data
# ─────────────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────────────
# 경로 설정 및 데이터 캐시
# ─────────────────────────────────────────────────────────────────────
DATA_DIR: Path = Path(settings.BASE_DIR) / "data"
FAISS_INDEX_PATH: Path = DATA_DIR / "vectorDB_index.faiss"     # 파일명은 네가 가진 이름에 맞춤
METADATA_PATH: Path = DATA_DIR / "metadata.json"

# 캐시 (서버 구동 중 재사용)
_INDEX: faiss.Index | None = None
_METADATA: List[Dict[str, Any]] | None = None


# ─────────────────────────────────────────────────────────────────────
# 책임 1: 데이터 로드 (성능최적화 되어있음) 함수앞에_가 붙음
# 유사도 검사를 하려면 열어야함 -> 서버가 켜질 때 단 한 번만 파일을 열어서 그 내용을 컴퓨터 **메모리에 저장(캐싱)** 해두고 있음
# ─────────────────────────────────────────────────────────────────────
def _load_faiss_index_and_metadata() -> Tuple[faiss.Index, List[Dict[str, Any]]]:
    """FAISS 인덱스와 메타데이터를 1회 로드 후 캐시."""
    global _INDEX, _METADATA

    if _INDEX is not None and _METADATA is not None:
        return _INDEX, _METADATA

    if not FAISS_INDEX_PATH.exists():
        raise FileNotFoundError(f"FAISS index not found: {FAISS_INDEX_PATH}")
    if not METADATA_PATH.exists():
        raise FileNotFoundError(f"metadata not found: {METADATA_PATH}")

    # 메타데이터 로드
    with METADATA_PATH.open("r", encoding="utf-8") as f:
        metadata_list = json.load(f)
        if not isinstance(metadata_list, list):
            raise ValueError("metadata.json 형식이 올바르지 않습니다. (list expected)")

    # FAISS 인덱스 로드
    index = faiss.read_index(str(FAISS_INDEX_PATH))

    _INDEX = index
    _METADATA = metadata_list
    return _INDEX, _METADATA


# def json_to_dict(user_info_json: str) -> Dict[str, Any]:
#     return json.loads(user_info_json)


# def concat_dict_values(d: Dict[str, Any], sep: str = " ") -> str:
#     return sep.join(str(v).strip() for v in d.values() if v is not None and str(v).strip() != "")


# # ============= 임베딩/GPT =============
# def get_embedding(text: str, model: str = "text-embedding-3-small") -> List[float]:
#     """
#     OpenAI 임베딩 (float32로 변환해서 반환)
#     """
#     resp = client.embeddings.create(
#         input=text,
#         model=model,
#     )
#     emb = resp.data[0].embedding
#     # list[float] → np.ndarray(float32)
#     # (search 전에 dtype 보장)
#     return emb


# def _chat_once(system_msg: str, user_msg: str, model: str = "gpt-4o-mini", temperature: float = 0.5, max_tokens: int = 150) -> str:
#     resp = client.chat.completions.create(
#         model=model,
#         messages=[
#             {"role": "system", "content": system_msg},
#             {"role": "user", "content": user_msg},
#         ],
#         max_tokens=max_tokens,
#         temperature=temperature,
#     )
#     return (resp.choices[0].message.content or "").strip()


# ─────────────────────────────────────────────────────────────────────
# 책임 2: 벡터 유사도 검색
# ─────────────────────────────────────────────────────────────────────
def similarity_search(index: faiss.Index, vector: List[float] | np.ndarray, k: int = 3) -> Tuple[np.ndarray, np.ndarray]:
    """
    벡터DB 검색. 입력을 float32, (1, d) 로 보정하고 L2 정규화 후 검색.
    """
    if not isinstance(vector, np.ndarray):
        query = np.asarray(vector, dtype=np.float32)
    else:
        query = vector.astype(np.float32, copy=False)

    if query.ndim == 1:
        query = query.reshape(1, -1)

    # L2 정규화 (인덱스가 내적 기반일 때 유사도 보정을 위해)
    faiss.normalize_L2(query)

    D, I = index.search(query, k) #여기서 검사
    return D, I  # 거리, 인덱스


# ─────────────────────────────────────────────────────────────────────
# 책임 3: 검색 결과를 메타데이터와 매핑
# ─────────────────────────────────────────────────────────────────────
def build_recommendation_entries(I: np.ndarray, metadata_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    검색 결과 인덱스(I)에 해당하는 메타데이터를 camelCase 키로 변환하여 리스트로 구성.
    """
    recommendations: List[Dict[str, Any]] = []
    for idx in I[0]:
        if idx == -1:
            continue
        rec = metadata_list[idx]
        job_entry = {
            "jobName":         rec.get("jobName", ""),
            "jobSum":          rec.get("jobSum", ""),
            "way":             rec.get("way", ""),
            "major":           rec.get("major", ""),
            "certificate":     rec.get("certificate", ""),
            "pay":             rec.get("pay", ""),
            "jobProspect":     rec.get("jobProspect", ""),
            "knowledge":       rec.get("knowledge", ""),
            "jobEnvironment":  rec.get("jobEnvironment", ""),
            "jobValues":       rec.get("jobValues", ""),
        }
        recommendations.append(job_entry)
    return recommendations


# # ============= GPT 이유 생성 =============
# def get_recommendation_reason(user_text: str, recommendations: List[Dict[str, Any]]) -> List[str]:
#     """
#     각 추천 직업마다 1~2문장 이유 생성
#     """
#     reasons: List[str] = []
#     for rec in recommendations:
#         job_name = rec.get("jobName", "")
#         job_summary = ", ".join(f"{k}: {v}" for k, v in rec.items() if v)

#         system_msg = "너는 직업 추천 전문가야."
#         user_msg = (
#             f"사용자 설명: {user_text}\n"
#             f"추천 직업: {job_name}\n"
#             f"직업 요약: {job_summary}\n"
#             "이 직업을 추천한 이유를 1~2문장으로 설명해줘."
#             " (예시: 창의성과 소통 능력이 요구되며, 다양한 사람들과 협업하는 것을 즐기는 사용자 성향과 일치합니다)"
#         )
#         reasons.append(_chat_once(system_msg, user_msg))
#     return reasons

# #recommendations에 reson 추가
# def add_reasons_to_recommendations(recommendations: List[Dict[str, Any]], reasons: List[str]) -> List[Dict[str, Any]]:
#     for rec, reason in zip(recommendations, reasons):
#         rec["reason"] = reason
#     return recommendations


# def get_overall_reason(user_text: str, recommendations: List[Dict[str, Any]]) -> str:
#     """
#     3개 추천을 종합한 한 문장 메시지
#     """
#     job_summary = "; ".join(", ".join(f"{k}: {v}" for k, v in rec.items() if v) for rec in recommendations)

#     system_msg = "너는 직업 추천 전문가야."
#     user_msg = (
#         f"사용자 설명: {user_text}\n"
#         f"직업 요약: {job_summary}\n"
#         "이 직업 3가지 추천한 이유를 1문장으로 설명해줘."
#         " (예시: <직업1>, <직업2>, <직업3>은 당신의 ~한 성향과 잘 어울립니다!)"
#     )
#     return _chat_once(system_msg, user_msg)


# # ============= 메인 진입점 =============
# def get_recommend(user_info: Dict[str, Any] | str) -> Dict[str, Any]:
#     """
#     recommendation.py 에서 호출하는 공개 함수.
#     반환 형태:
#     {
#         "recommendations": [ {jobName, jobSum, ... , reason}, ... ],  # 최소 1~3개
#         "gpt_message": "..."                                           # 전체 요약
#     }
#     """

#     # user_info → 사용자 설명 텍스트
#     if isinstance(user_info, dict):
#         user_text = concat_dict_values(user_info)
#     elif isinstance(user_info, str):
#         user_text = concat_dict_values(json_to_dict(user_info))
#     else:
#         raise ValueError("user_info must be dict or JSON string")

#     # 벡터DB/메타데이터
#     index, metadata_list = _load_faiss_index_and_metadata()

#     # 임베딩 & 검색
#     emb = get_embedding(user_text)                     # list[float]
#     D, I = similarity_search(index, np.asarray(emb))   # (1, d)로 정규화해 검색

#     # 메타데이터 → 추천 엔트리
#     recommendations = build_recommendation_entries(I, metadata_list)

#     if not recommendations:
#         return {"recommendations": [], "gpt_message": ""}

#     # 이유 생성 & 합치기
#     reasons = get_recommendation_reason(user_text, recommendations)
#     jobs = add_reasons_to_recommendations(recommendations, reasons)
#     gpt_message = get_overall_reason(user_text, recommendations)

#     return {
#         "recommendations": jobs,
#         "gpt_message": gpt_message,
#     }
