# 필요 import 파일 모음
import os
import faiss
import numpy as np
import json
from openai import OpenAI

def load_faiss_index_and_metadata():
    # 현재 recommendJob.py 파일의 절대 경로
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    # recommend/ 폴더 경로 (service의 상위 폴더)
    base_dir = os.path.dirname(os.path.dirname(cur_dir))
    # data 폴더 경로
    data_dir = os.path.join(base_dir, "data")

    # 파일 경로 설정
    faiss_index_path = os.path.join(data_dir, "vectorDB_index.faiss")
    metadata_path = os.path.join(data_dir, "metadata.json")
    print(faiss_index_path)
    print(metadata_path)

    # 메타데이터 로드
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata_list = json.load(f)

    # FAISS 인덱스 로드
    index = faiss.read_index(faiss_index_path)

    return index, metadata_list

index, metadata_list = load_faiss_index_and_metadata()

# 유사도 검색
def similarity_search(index, vector, k=3): # 벡터DB, 임베딩된 사용자text, 검색 개수
 # 리스트면 numpy 배열로 변환, float32 타입 보장
    if not isinstance(vector, np.ndarray):
        query_vector = np.array(vector, dtype=np.float32)
    else:
        query_vector = vector.astype(np.float32)

    # 1차원 벡터면 (1, 차원) 형태로 변환
    if query_vector.ndim == 1:
        query_vector = query_vector.reshape(1, -1)

    # L2 정규화
    faiss.normalize_L2(query_vector)

    # k개 유사도 검색
    D, I = index.search(query_vector, k)
    return D, I # 거리, 검색된 인덱스

embedding_dim = 1536
temp_vector = np.random.rand(embedding_dim).astype('float32')

D, I = similarity_search(index, temp_vector)
print(D)
print(I)

def connect_metadata(matadatas, I):
    recommend_results = []
    for idx in I[0]:
        if idx != -1:
            recommend_results.append(metadata_list[idx]), type(metadata_list[idx])
    return recommend_results

recommend_results = connect_metadata(metadata_list, I)
print(recommend_results[0])

# 추천항목 정리
def build_recommendation_entries(indices, metadata):
    recommendations = []
    for idx in indices[0]:
        if idx == -1:
            continue
        rec = metadata[idx]

        job_entry = {
            "jobName": rec.get("jobName", ""),
            "jobSum": rec.get("jobSum", ""),
            "way": rec.get("way", ""),
            "major": rec.get("major", ""),
            "certificate": rec.get("certificate", ""),
            "pay": rec.get("pay", ""),
            "jobProspect": rec.get("jobProspect", ""),
            "knowledge": rec.get("knowledge", ""),
            "jobEnvironment": rec.get("jobEnvironment", ""),
            "jobValues": rec.get("jobValues", "")
        }
        recommendations.append(job_entry)
    return recommendations

recommendations = build_recommendation_entries(I, metadata_list)

# def get_recommendation_reason(user_text, recommendations):