"""
generator/services/mock_strategy.py
Deterministic mock strategy for offline development and testing.
"""
import uuid
from .strategy import SongGeneratorStrategy


class MockSongGeneratorStrategy(SongGeneratorStrategy):
    """
    Offline, deterministic strategy that produces predictable output
    without calling any external API. Used for development/testing.
    """

    def generate(self, song_profile) -> str:
        """
        Returns a fake UUID-based task ID instantly.
        """
        return f"mock-task-{uuid.uuid4().hex[:8]}"

    def check_status(self, task_id: str) -> dict:
        """
        Always returns SUCCESS with a placeholder audio URL.
        """
        return {
            "status": "SUCCESS",
            "audio_url": "https://example.com/mock_audio.mp3",
        }
