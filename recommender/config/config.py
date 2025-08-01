import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 환경 변수에서 키 읽기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
