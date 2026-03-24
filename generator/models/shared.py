"""
generator/models/shared.py
SharedLink domain model — manages unique URLs for external song distribution.
"""
import uuid
from django.db import models
from .song import Song


class SharedLink(models.Model):
    """
    Manages unique URLs for external distribution.
    Instant revocation is enforced by on_delete=CASCADE:
    when a Song is deleted its SharedLink is deleted too,
    causing any shared URL to return 404 (FR-20, business rule 'Instant Revocation').
    """
    song = models.OneToOneField(
        Song,
        on_delete=models.CASCADE,   # Link is revoked immediately on song deletion
        related_name='shared_link',
    )
    unique_url = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text='UUID-backed unique share token used to build the share URL.',
    )
    allow_download = models.BooleanField(
        default=False,
        help_text='If True, authenticated recipients may download the MP3 (FR-22).',
    )

    class Meta:
        verbose_name = 'Shared Link'
        verbose_name_plural = 'Shared Links'

    def __str__(self):
        return f'SharedLink for "{self.song.title}" (download={self.allow_download})'
