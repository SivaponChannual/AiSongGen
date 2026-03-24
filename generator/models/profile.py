"""
generator/models/profile.py
SongProfile domain model — encapsulates AI generation parameters per song.
"""
from django.db import models
from .enums import Genre, Mood, Occasion, VocalType
from .song import Song


class SongProfile(models.Model):
    """
    A value object that encapsulates the parameters selected in the
    Structured Generation Form to drive the AI engine.

    requested_length stores the user-specified duration in seconds
    (FR-06: range 120–360 seconds / 2–6 minutes).
    This is used by Song.clean() to enforce the ±10-second variance rule.
    """
    song = models.OneToOneField(
        Song,
        on_delete=models.CASCADE,
        related_name='song_profile',
    )
    description = models.TextField(blank=True, default='')
    occasion = models.CharField(
        max_length=20,
        choices=Occasion.choices,
    )
    genre = models.CharField(
        max_length=20,
        choices=Genre.choices,
    )
    mood = models.CharField(
        max_length=20,
        choices=Mood.choices,
    )
    vocal_selection = models.CharField(
        max_length=20,
        choices=VocalType.choices,
    )
    # FR-06: user-specified target duration in seconds (120–360)
    requested_length = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Desired song length in seconds (120–360 s / 2–6 minutes).',
    )

    class Meta:
        verbose_name = 'Song Profile'
        verbose_name_plural = 'Song Profiles'

    def __str__(self):
        return (
            f'Profile for "{self.song.title}" '
            f'[{self.genre} / {self.mood} / {self.occasion}]'
        )
