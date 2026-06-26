from django.urls import path
from aligner import views

urlpatterns = [
    path("api/analyze/", views.analyze_resume, name="analyze"),
    path("api/career-path/", views.generate_career_path, name="career_path"),
    path("", views.index),
    path("<path:path>", views.index, name="spa_catchall"),
]