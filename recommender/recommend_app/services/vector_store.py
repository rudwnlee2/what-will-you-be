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
