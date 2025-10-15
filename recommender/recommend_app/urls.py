from django.urls import path
from .views import RecommendAPIView

app_name = 'recommend_app'  # ✅ 추가

urlpatterns = [
    path('recommend/', RecommendAPIView.as_view(), name='recommend'),
]
