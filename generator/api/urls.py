"""
generator/api/urls.py
URL patterns for the generator API.
"""
from django.urls import path
from .views import (
    UserListCreateView,
    UserDetailView,
    SongListCreateView,
    SongDetailView,
)

urlpatterns = [
    # User endpoints
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Song endpoints (UUID primary key)
    path('songs/', SongListCreateView.as_view(), name='song-list-create'),
    path('songs/<uuid:pk>/', SongDetailView.as_view(), name='song-detail'),
]
