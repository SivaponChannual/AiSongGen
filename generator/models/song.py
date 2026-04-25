"""
generator/models/song.py
Song domain model — the central domain object for synthesized audio tracks.
"""
import uuid
from django.core.exceptions import ValidationError
from django.db import models
from .enums import GenerationStatus
from .library import MediaLibrary


class Song(models.Model):
    """
    Represents a synthesized audio track.
    Enforces the ±10-second duration variance business rule via clean().
    """
    song_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    # Title: UTF-8, max 256 characters (FR-03, FR-16)
    title = models.CharField(max_length=256)
    creation_timestamp = models.DateTimeField(auto_now_add=True)
    audio_file_url = models.URLField(max_length=2048, blank=True, default='')
    duration = models.DurationField(
        null=True,
        blank=True,
        help_text='Actual duration of the generated audio track.',
    )
    is_favorited = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=GenerationStatus.choices,
        default=GenerationStatus.GENERATING,
    )
    media_library = models.ForeignKey(
        MediaLibrary,
        on_delete=models.CASCADE,
        related_name='songs',
    )
    generation_task_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Task ID returned by the generation strategy (mock or Suno API).',
    )

    class Meta:
        verbose_name = 'Song'
        verbose_name_plural = 'Songs'
        ordering = ['-creation_timestamp']

    def __str__(self):
        return f'{self.title} [{self.status}]'

    def clean(self):
        """
        Business Logic Constraint (FR-24 / Domain Constraint 'Audio Precision'):
        The actual song duration must be within ±10 seconds of the
        requested_length stored in the associated SongProfile.

        This guard runs only when:
        1. The song has an actual duration.
        2. A SongProfile with a requested_length has been saved.
        """
        super().clean()

        if self.duration is None:
            return  # Cannot validate without actual duration

        # Access the reverse OneToOne relation safely
        try:
            profile = self.song_profile  # reverse accessor set in SongProfile
        except Exception:
            return  # Profile not yet saved; skip validation

        if profile.requested_length is None:
            return

        actual_seconds = self.duration.total_seconds()
        requested_seconds = profile.requested_length
        variance = abs(actual_seconds - requested_seconds)

        if variance > 10:
            raise ValidationError(
                f'Song duration ({actual_seconds:.1f}s) exceeds the allowed '
                f'±10-second variance from the requested length '
                f'({requested_seconds}s). Actual variance: {variance:.1f}s.'
            )
