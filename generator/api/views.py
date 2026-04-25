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

  Generation:
    POST /api/songs/generate/        -> SongGenerateView
"""
import logging
from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from generator.models import Song, SongProfile, MediaLibrary
from generator.serializers import UserSerializer, SongSerializer
from generator.models import User
from generator.services.factory import GeneratorFactory

logger = logging.getLogger(__name__)


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


# ──────────────── Song Generation (Strategy Pattern) ────────────────

class SongGenerateView(APIView):
    """
    POST /api/songs/generate/

    Accepts generation parameters, creates a Song + SongProfile,
    invokes the active generation strategy, and returns the result.

    Request body (JSON):
    {
        "title": "Morning Drive Mix",
        "media_library": 1,
        "occasion": "COMMUTE",
        "genre": "JDM",
        "mood": "ENERGETIC",
        "vocal_selection": "MALE",
        "requested_length": 180
    }
    """

    def post(self, request):
        data = request.data

        # ── Validate required fields ──
        required_fields = ['title', 'media_library', 'occasion', 'genre', 'mood', 'vocal_selection']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Resolve the MediaLibrary ──
        try:
            library = MediaLibrary.objects.get(pk=data['media_library'])
        except MediaLibrary.DoesNotExist:
            return Response(
                {"error": f"MediaLibrary with id {data['media_library']} not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ── Create Song ──
        song = Song.objects.create(
            title=data['title'],
            media_library=library,
        )

        # ── Create SongProfile ──
        profile = SongProfile.objects.create(
            song=song,
            occasion=data['occasion'],
            genre=data['genre'],
            mood=data['mood'],
            vocal_selection=data['vocal_selection'],
            requested_length=data.get('requested_length'),
        )

        # ── Invoke Strategy Pattern ──
        strategy = GeneratorFactory.get_generator()
        strategy_name = type(strategy).__name__

        logger.info(f"[Strategy Pattern] Using strategy: {strategy_name}")

        try:
            task_id = strategy.generate(profile)
            song.generation_task_id = task_id
            song.save(update_fields=['generation_task_id'])
            logger.info(f"[Strategy Pattern] Generation started — task_id: {task_id}")
        except Exception as e:
            song.status = 'FAILED'
            song.save(update_fields=['status'])
            logger.error(f"[Strategy Pattern] Generation failed: {e}")
            return Response(
                {"error": f"Generation failed: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "message": "Song generation initiated.",
                "strategy": strategy_name,
                "song_id": str(song.song_id),
                "title": song.title,
                "generation_task_id": task_id,
                "status": song.status,
            },
            status=status.HTTP_201_CREATED,
        )
