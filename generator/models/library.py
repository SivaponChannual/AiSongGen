"""
generator/models/library.py
MediaLibrary domain model — a logical container for a user's song collection.
"""
from django.db import models
from .user import User


class MediaLibrary(models.Model):
    """
    A logical container that organizes a user's song collection.
    Enforces data isolation between different users' data.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='media_library',
    )
    song_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Media Library'
        verbose_name_plural = 'Media Libraries'

    def __str__(self):
        return f"Library of {self.user.user_email} ({self.song_count} songs)"
