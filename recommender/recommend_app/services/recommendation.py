# recommend_app/services/recommendation.py
import vector_store

# vector_store.get_recommend(user_input)
def generate_recommendation(user_input):
    """
    user_input: {
        'dream': "...",
        'mbti': "...",
        'interest': "..."
    }

    return: {
        "recommendations": [  # 직업 3개 리스트
            {"job": "기획자", "reason": "창의적이고 기획력 있음"},
            {"job": "상담사", "reason": "사람들과 잘 소통함"},
            {"job": "강사", "reason": "지식 전달과 소통을 즐김"}
        ],
        "gpt_message": "당신의 성향에는 기획자, 상담사, 강사와 같은 직업이 잘 어울립니다!"
    }
    """
    return {
        "recommendations": [
            {"job": "기획자", "reason": "창의적이고 기획력 있음"},
            {"job": "상담사", "reason": "사람들과 잘 소통함"},
            {"job": "강사", "reason": "지식 전달과 소통을 즐김"}
        ],
        "gpt_message": "당신의 성향에는 기획자, 상담사, 강사와 같은 직업이 잘 어울립니다!"
    }
