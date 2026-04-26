"""
generator/services/mock_strategy.py
Deterministic mock strategy for offline development and testing.
"""
import uuid
import random
from .strategy import SongGeneratorStrategy


class MockSongGeneratorStrategy(SongGeneratorStrategy):
    """
    Offline, deterministic strategy that produces predictable output
    without calling any external API. Used for development/testing.
    """

    # Mock album art URLs using placeholder services
    MOCK_ALBUM_ARTS = [
        "https://picsum.photos/seed/music1/400/400",
        "https://picsum.photos/seed/music2/400/400",
        "https://picsum.photos/seed/music3/400/400",
        "https://picsum.photos/seed/music4/400/400",
        "https://picsum.photos/seed/music5/400/400",
    ]

    def generate(self, song_profile) -> str:
        """
        Returns a fake UUID-based task ID instantly.
        """
        return f"mock-task-{uuid.uuid4().hex[:8]}"

    def check_status(self, task_id: str) -> dict:
        """
        Always returns SUCCESS with placeholder audio and image URLs.
        """
        # Use task_id to deterministically select an album art
        seed = int(task_id.split('-')[-1][:4], 16) if '-' in task_id else 0
        album_art = self.MOCK_ALBUM_ARTS[seed % len(self.MOCK_ALBUM_ARTS)]
        
        return {
            "status": "SUCCESS",
            "audio_url": "https://example.com/mock_audio.mp3",
            "image_url": album_art,
        }
