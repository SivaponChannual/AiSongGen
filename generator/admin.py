"""
generator/admin.py
Registers all domain models in the Django Admin for easy verification.
"""
from django.contrib import admin
from .models import User, MediaLibrary, Song, SongProfile, SharedLink


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'google_id', 'onboarding_status')
    search_fields = ('user_email', 'google_id')
    list_filter = ('onboarding_status',)


@admin.register(MediaLibrary)
class MediaLibraryAdmin(admin.ModelAdmin):
    list_display = ('user', 'song_count')
    search_fields = ('user__user_email',)


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'is_favorited', 'creation_timestamp', 'media_library')
    list_filter = ('status', 'is_favorited')
    search_fields = ('title',)
    readonly_fields = ('song_id', 'creation_timestamp')


@admin.register(SongProfile)
class SongProfileAdmin(admin.ModelAdmin):
    list_display = ('song', 'genre', 'mood', 'occasion', 'vocal_selection', 'requested_length')
    list_filter = ('genre', 'mood', 'occasion', 'vocal_selection')


@admin.register(SharedLink)
class SharedLinkAdmin(admin.ModelAdmin):
    list_display = ('song', 'unique_url', 'allow_download')
    list_filter = ('allow_download',)
    readonly_fields = ('unique_url',)
