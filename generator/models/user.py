"""
generator/models/user.py
User domain model — authenticated via Google OAuth 2.0.
"""
from django.db import models


class User(models.Model):
    """
    Represents an authenticated creator via Google OAuth 2.0.
    Manages identity and acts as the owner for all associated media assets.
    """
    google_id = models.CharField(max_length=255, unique=True)
    user_email = models.EmailField(unique=True)
    onboarding_status = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.user_email} ({self.google_id})'
