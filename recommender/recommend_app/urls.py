# recommend_app/urls.py

from django.urls import path
from .views import RecommendAPIView  # RecommendAPIView는 views.py에 작성할 예정

urlpatterns = [
    path("recommend/", RecommendAPIView.as_view(), name="recommend"),
]
