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
METADATA_PATH: Path = DATA_DIR / "metadata.json" # 사용자에게 보여줄 메타데이터
CHUNKS_META_PATH: Path = DATA_DIR / "chunks_meta.json" # 벡터DB와 metadata_list를 이어줄 중간다리

# 캐시 (서버 구동 중 재사용)
_INDEX: faiss.Index | None = None
_METADATA: List[Dict[str, Any]] | None = None
_CHUNKS_META: List[Dict[str, Any]] | None = None

# ─────────────────────────────────────────────────────────────────────
# 책임 1: 데이터 로드 (성능최적화 되어있음) 함수앞에_가 붙음
# 유사도 검사를 하려면 열어야함 -> 서버가 켜질 때 단 한 번만 파일을 열어서 그 내용을 컴퓨터 **메모리에 저장(캐싱)** 해두고 있음
# ─────────────────────────────────────────────────────────────────────
def _load_faiss_index_and_metadata() -> Tuple[faiss.Index, List[Dict[str, Any]]]:
    """FAISS 인덱스와 메타데이터를 1회 로드 후 캐시."""
    global _INDEX, _METADATA, _CHUNKS_META

    if _INDEX is not None and _METADATA is not None:
        return _INDEX, _METADATA, _CHUNKS_META

    if not FAISS_INDEX_PATH.exists():
        raise FileNotFoundError(f"FAISS index not found: {FAISS_INDEX_PATH}")
    if not METADATA_PATH.exists():
        raise FileNotFoundError(f"metadata not found: {METADATA_PATH}")
    if not CHUNKS_META_PATH.exists():
        raise FileNotFoundError(f"metadata not found: {_CHUNKS_META}")

    # 메타데이터 로드
    with METADATA_PATH.open("r", encoding="utf-8") as f:
        metadata_list = json.load(f)
        if not isinstance(metadata_list, list):
            raise ValueError("metadata.json 형식이 올바르지 않습니다. (list expected)")
    # 벡터DB의 청크 정보 로드
    with CHUNKS_META_PATH.open("r", encoding="utf-8") as f:
        chunks_meta = json.load(f)
        if not isinstance(chunks_meta, list):
            raise ValueError("chunks_meta.json 형식이 올바르지 않습니다. (list expected)")

    # FAISS 인덱스 로드
    index = faiss.read_index(str(FAISS_INDEX_PATH))

    _INDEX = index
    _METADATA = metadata_list
    _CHUNKS_META = chunks_meta
    return _INDEX, _METADATA, _CHUNKS_META


# ─────────────────────────────────────────────────────────────────────
# 책임 2: 벡터 유사도 검색
# ─────────────────────────────────────────────────────────────────────
def similarity_search(index, query_vector, chunks_meta, top_jobs=3, step=10):
    """
    벡터DB에서 query_vector와 유사한 청크를 검색하되,
    서로 다른 job_id가 top_jobs 개 나올 때까지 확장 검색.

    Args:
        index: FAISS 인덱스 객체
        query_vector: 사용자 입력에 대한 임베딩 벡터
        chunks_meta: chunks_meta 메타데이터 목록 (청크 단위)
        top_jobs: 필요한 직업 수 (기본 3)
        step: 한 번에 확장하는 청크 수 (기본 10)

    Returns:
        selected_job_ids: 추천할 직업 ID 리스트
        selected_indices: 각 직업을 대표하는 청크 인덱스 리스트
    """
    # 입력 벡터를 numpy array로 변환하고 float32 타입으로, 2차원 (1, d) 형태로 조정
    query_vector = np.array(query_vector).astype('float32').reshape(1, -1)
    total_chunks = len(chunks_meta)  # 전체 청크 개수

    k = step  # 초기 검색할 청크 개수
    unique_jobs = {}  # job_id를 키로, 해당 직업을 대표하는 청크 인덱스를 값으로 저장
    seen_indices = set()  # 이미 검색한 청크 인덱스 추적 (중복 방지)

    # 원하는 직업 수가 모일 때까지 또는 모든 청크를 다 검색할 때까지 반복
    while len(unique_jobs) < top_jobs and k <= total_chunks:
        # FAISS 검색: k개의 청크 유사도 검색
        D, I = index.search(query_vector, k)
        indices = I[0]  # 검색된 청크 인덱스 배열

        for idx in indices:
            if idx in seen_indices:  # 이미 처리한 청크면 건너뜀
                continue
            seen_indices.add(idx)  # 새 청크라면 처리 기록에 추가

            job_info = chunks_meta[idx]  # 해당 청크의 메타데이터
            job_id = job_info.get("job_id")  # 청크가 속한 직업 ID

            # job_id가 존재하고 아직 unique_jobs에 없으면 저장
            if job_id and job_id not in unique_jobs:
                unique_jobs[job_id] = idx  # 이 직업을 대표하는 청크 인덱스 저장

        k += step  # 충분한 직업이 모이지 않았다면, 검색 범위 확대

    # 최종 추천 직업 ID 리스트 (top_jobs 개수 제한)
    selected_job_ids = list(unique_jobs.keys())[:top_jobs]
    # 각 직업의 대표 청크 인덱스 리스트
    selected_indices = [unique_jobs[jid] for jid in selected_job_ids]
    print("job_ids: ", selected_job_ids, " indices: ", selected_indices)
    return selected_job_ids, selected_indices



# ─────────────────────────────────────────────────────────────────────
# 책임 3: 검색 결과를 메타데이터와 매핑
# ─────────────────────────────────────────────────────────────────────
def build_job_metadata(selected_job_ids: List[str], chunks_meta: List[Dict[str, Any]],
                       metadata_list: List[Dict[str, Any]]) \
        -> List[Dict[str, Any]]:
    """
    선택된 job_id 리스트를 받아, chunks_meta와 연결하고,
    jobName 기준으로 사용자에게 보여줄 메타데이터 생성.

    Args:
        selected_job_ids: FAISS 검색 후 선택된 직업 ID 리스트
        chunks_meta: 청크 단위 메타데이터 (job_id 포함)
        metadata_list: 사용자에게 보여줄 직업 단위 메타데이터 (jobName 기준)

    Returns:
        List[Dict[str, Any]]: 직업 단위로 구성된 추천 메타데이터
    """
    selected_jobs = []

    # job_id → jobName 매핑 (chunks_meta 기준)
    job_id_to_name = {chunk["job_id"]: chunk["jobName"] for chunk in chunks_meta}

    for job_id in selected_job_ids:
        job_name = job_id_to_name.get(job_id)
        if not job_name:
            continue  # 혹시 매핑 안된 경우 skip

        # jobName 기준으로 metadata_list에서 직업 정보 찾기
        for rec in metadata_list:
            if rec.get("jobName") == job_name:
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
                selected_jobs.append(job_entry)
                break  # 같은 jobName 중복 처리 방지

    return selected_jobs
