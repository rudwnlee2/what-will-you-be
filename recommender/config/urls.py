"""
URL configuration for recommender.config project.
"""

from django.contrib import admin
from django.urls import path, include   # ✅ include 추가

urlpatterns = [
    path('admin/', admin.site.urls),
    # ✅ recommend_app 라우트 추가 → /api/ 밑으로 연결
    path('api/', include('recommend_app.urls')),
]