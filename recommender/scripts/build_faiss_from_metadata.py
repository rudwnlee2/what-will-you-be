# recommender/scripts/build_faiss_from_metadata.py
from __future__ import annotations
from pathlib import Path
import json
import time
from typing import Dict, List

import numpy as np
import faiss
from openai import OpenAI

# 1) 설정 로드 (.env -> config.py)
from recommender.config import config   # OPENAI_API_KEY, EMBEDDING_MODEL 사용

# 2) 경로
PROJ_ROOT = Path(__file__).resolve().parents[2]  # WHAT-WILL-YOU-BE/
DATA_DIR = PROJ_ROOT / "recommender" / "data"
METADATA_PATH = DATA_DIR / "metadata.json"
FAISS_PATH = DATA_DIR / "vectorDB_index.faiss"

# 3) OpenAI 클라이언트
client = OpenAI(api_key=config.OPENAI_API_KEY)
MODEL = config.EMBEDDING_MODEL  # ex) text-embedding-3-small

# 4) 메타데이터에서 임베딩에 쓸 텍스트 만들기
_CAMEL = ["jobName","jobSum","knowledge","jobEnvironment","jobValues",
          "major","way","certificate","pay","jobProspect"]
_SNAKE = ["job_name","job_sum","knowledge","job_environment","job_values",
          "major","way","certificate","pay","job_prospect"]

def textify(rec: Dict) -> str:
    parts: List[str] = []
    # camelCase 우선
    for k in _CAMEL:
        v = rec.get(k)
        if v: parts.append(str(v))
    # snake_case 보강
    for k in _SNAKE:
        v = rec.get(k)
        if v: parts.append(str(v))
    return " ".join(parts) if parts else ""

def load_metadata() -> List[Dict]:
    if not METADATA_PATH.exists():
        raise FileNotFoundError(f"메타데이터가 없습니다: {METADATA_PATH}")
    with METADATA_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list) or len(data) == 0:
        raise ValueError("metadata.json 내용이 비었거나 리스트가 아닙니다.")
    return data

# 5) 배치 임베딩
def embed_batch(texts: List[str], model: str, batch_size: int = 64, pause: float = 0.2) -> np.ndarray:
    vecs: List[List[float]] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        # 빈 문자열은 모델이 싫어할 수 있으므로 대체
        batch = [t if t.strip() else "직업 정보 없음" for t in batch]
        resp = client.embeddings.create(model=model, input=batch)
        vecs.extend([d.embedding for d in resp.data])
        if pause: time.sleep(pause)  # API 레이트 제한 완화
        print(f"embedded {min(i+batch_size, len(texts))}/{len(texts)}")
    arr = np.array(vecs, dtype="float32")
    return arr

def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # (A) 메타데이터 로드
    recs = load_metadata()
    texts = [textify(r) for r in recs]
    if not any(texts):
        raise ValueError("메타데이터에서 임베딩할 텍스트가 생성되지 않았습니다.")

    # (B) 임베딩 생성
    print(f"Embedding {len(texts)} docs with model={MODEL} ...")
    vecs = embed_batch(texts, MODEL, batch_size=64, pause=0.2)  # 필요시 batch/pause 조정
    dim = vecs.shape[1]
    print("embedding dim:", dim)

    # (C) 벡터 정규화(+L2 인덱스)
    # 쿼리에서도 L2 정규화를 하므로, 인덱스 벡터도 정규화해서 코사인과 유사하게 맞춥니다.
    faiss.normalize_L2(vecs)

    # (D) FAISS 인덱스 생성 및 저장
    index = faiss.IndexFlatL2(dim)
    index.add(vecs)
    faiss.write_index(index, str(FAISS_PATH))
    print(f"✅ FAISS index saved: {FAISS_PATH} (ntotal={index.ntotal})")

    # (E) 메타데이터는 그대로 다시 저장(정렬/포맷만 다듬기)
    with METADATA_PATH.open("w", encoding="utf-8") as f:
        json.dump(recs, f, ensure_ascii=False, indent=2)
    print(f"✅ metadata saved: {METADATA_PATH} (items={len(recs)})")

if __name__ == "__main__":
    main()
