# recommendation/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("recommend_app.urls")),  # ← 이 줄 꼭 추가!
]
