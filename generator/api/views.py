"""
generator/api/views.py
Full CRUD API views using DRF Generic Views.

Endpoints:
  Users:
    GET/POST    /api/users/          -> UserListCreateView
    GET/PUT/PATCH/DELETE /api/users/<pk>/  -> UserDetailView

  Songs:
    GET/POST    /api/songs/          -> SongListCreateView
    GET/PUT/PATCH/DELETE /api/songs/<pk>/  -> SongDetailView
"""
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from generator.models import User, Song
from generator.serializers import UserSerializer, SongSerializer


# ──────────────── User CRUD ────────────────

class UserListCreateView(ListCreateAPIView):
    """
    GET  /api/users/  — List all users.
    POST /api/users/  — Create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET    /api/users/<pk>/  — Retrieve a user.
    PUT    /api/users/<pk>/  — Full update a user.
    PATCH  /api/users/<pk>/  — Partial update a user.
    DELETE /api/users/<pk>/  — Delete a user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


# ──────────────── Song CRUD ────────────────

class SongListCreateView(ListCreateAPIView):
    """
    GET  /api/songs/  — List all songs.
    POST /api/songs/  — Create a new song.
    """
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class SongDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET    /api/songs/<pk>/  — Retrieve a song.
    PUT    /api/songs/<pk>/  — Full update a song.
    PATCH  /api/songs/<pk>/  — Partial update a song.
    DELETE /api/songs/<pk>/  — Delete a song (also cascades SharedLink).
    """
    queryset = Song.objects.all()
    serializer_class = SongSerializer
