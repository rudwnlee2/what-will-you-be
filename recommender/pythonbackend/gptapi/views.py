from django.shortcuts import render

# Create your views here.
import openai
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

@csrf_exempt
def gpt_recommendation(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        prompt = body.get('prompt', '')

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "너는 진로 추천 전문가야."},
                {"role": "user", "content": prompt}
            ]
        )

        reply = response['choices'][0]['message']['content']
        return JsonResponse({'result': reply})
