import vector_store as vs
def generate_recommendation(user_input: dict) -> dict:
    return vs.get_recommend(user_input)
# return {
#     "recommendations": jobs # 직업정보 딕셔너리가 들어있는 리스트,
#     "gpt_message": gpt_message # str
# }