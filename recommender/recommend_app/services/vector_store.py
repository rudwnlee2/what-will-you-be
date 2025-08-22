# 필요 import 파일 모음
import os
import faiss
import numpy as np
import json
from openai import OpenAI
# from config.config import OPENAI_API_KEY # 경로 오류로 잠시 주석처리함
OPENAI_API_KEY = "key" # 오류 방지용
client = OpenAI(api_key=OPENAI_API_KEY)

# =============
# recommender/data 폴더에서 파일 불러오기. 테스트용으로 프로젝트 내에서 불러오게 함.
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

    # 메타데이터 로드
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata_list = json.load(f)

    # FAISS 인덱스 로드
    index = faiss.read_index(faiss_index_path)

    return index, metadata_list


# json 문자열을 입력받아 dict 형식으로 변환
def json_to_dict(user_info_json):
    data = json.loads(user_info_json)
    return data

# 딕셔너리의 value들을 이어붙이는 함수
def concat_dict_values(d: dict, sep: str = " "):
    return sep.join(str(v) for v in d.values() if v is not None)

def get_embedding(text: str, model="text-embedding-3-small"):
    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding
# 1. "text-embedding-ada-002"
# 2. "text-embedding-3-small"


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


# 인덱스 값에 맞는 메타데이터 연결
def connect_metadata(metadata_list, I):
    recommend_results = []
    for idx in I[0]:
        if idx != -1:
            recommend_results.append(metadata_list[idx]), type(metadata_list[idx])
    return recommend_results


# 추천항목 정리, "recommendations"의 일부
def build_recommendation_entries(I, metadata_list):
    recommendations = []
    for idx in I[0]:
        if idx == -1:
            continue
        rec = metadata_list[idx]

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

# =============
# 추천 이유 생성, "recommendations"의 일부
def get_recommendation_reason(user_text, recommendations):
    client = OpenAI(api_key=OPENAI_API_KEY)
    ressons = []
    for i in range(0, len(recommendations)):
        job_name = recommendations[i]['jobName']
        job_summary  = ', '.join(f"{k}: {v}" for k, v in recommendations[i].items())

        system_msg = "너는 직업 추천 전문가야."
        user_msg = (
            f"사용자 설명: {user_text}\n"
            f"추천 직업: {job_name}\n"
            f"직업 요약: {job_summary}\n"
            "이 직업을 추천한 이유를 1~2문장으로 설명해줘.(예시: 창의성과 소통 능력이 요구되며, 다양한 사람들과 협업하는 것을 즐기는 사용자 성향과 일치합니다)"
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            max_tokens=150,
            temperature=0.5, # 0~1, 값이 낮을수록 보수적이고 예측 가능한 문장 생성
        )
        ressons.append(response.choices[0].message.content.strip())
    return ressons # 추천이유 3개 담은 리스트


# 추천결과 리스트 안의 딕셔너리에 추천이유 추가하기
def add_reasons_to_recommendations(recommendations, reasons):
    for rec, reason in zip(recommendations, reasons):
        rec["reason"] = reason
    return recommendations

# 추천한 3가지 직업에 대한 전반적인 추천이유, "gpt_message"
def get_overall_reason(user_text, recommendations):
    client = OpenAI(api_key=OPENAI_API_KEY)

    job_summary  = '; '.join(
        ', '.join(f"{k}: {v}" for k, v in rec.items())
        for rec in recommendations
    )

    system_msg = "너는 직업 추천 전문가야."
    user_msg = (
        f"사용자 설명: {user_text}\n"
        f"직업 요약: {job_summary}\n"
        "이 직업 3가지 추천한 이유를 1문장으로 설명해줘(예시: <직업이름1>,<직업이름2>,<직업이름3>은 당신의 ~한 성향과 잘 어울립니다!)"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg}
        ],
        max_tokens=150,
        temperature=0.5, # 0~1, 값이 낮을수록 보수적이고 예측 가능한 문장 생성
    )
    overall_reason = response.choices[0].message.content.strip()
    return overall_reason # 전반적인 추천 이유 문자열


# 추천 함수. recommendation.py에서 vector_store를 임포트하여 이 함수만 호출할 수 있으면 됨.
# 이름 generate_recommendation()로 변경할 수 있음
def get_recommendation(user_info):
    # user_info가 dict일 경우 (이미 JSON 파싱 완료 상태)
    if isinstance(user_info, dict):
        user_text = concat_dict_values(user_info)
    # user_info가 문자열(json)일 경우
    elif isinstance(user_info, str):
        user_text = concat_dict_values(json_to_dict(user_info))

    # 벡터DB 인덱스, 메타데이터 불러오기
    index, metadata_list = load_faiss_index_and_metadata()

    # 임베딩 및 유사도 검색
    user_vector = get_embedding(user_text)
    D, I = similarity_search(index, user_vector)

    # 메타데이터 3개를 dict 리스트에 저장
    recommend_results = connect_metadata(metadata_list, I)
    # 추천 이유 추가할 메타데이터 리스트들
    recommendations = build_recommendation_entries(I, metadata_list)
    # 추천 이유 리스트 생성
    ressons = get_recommendation_reason(user_text, recommendations)
    # 추천결과리스트[i]에 추천이유[i] 추가
    jobs: dict = add_reasons_to_recommendations(recommendations, ressons)
    gpt_message = get_overall_reason(user_text, recommendations)

    return {
        "recommendations": jobs,
        "gpt_message": gpt_message
    }