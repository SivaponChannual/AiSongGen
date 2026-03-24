"""
generator/models/__init__.py
Re-exports all domain model classes so Django ORM discovers them
and they can be imported directly from generator.models.
"""
from .enums import Genre, Mood, Occasion, VocalType, GenerationStatus
from .user import User
from .library import MediaLibrary
from .song import Song
from .profile import SongProfile
from .shared import SharedLink

__all__ = [
    'Genre',
    'Mood',
    'Occasion',
    'VocalType',
    'GenerationStatus',
    'User',
    'MediaLibrary',
    'Song',
    'SongProfile',
    'SharedLink',
]
