"""
generator/services/suno_strategy.py
Suno API strategy for real external song generation via SunoApi.org.
"""
import requests
from django.conf import settings
from .strategy import SongGeneratorStrategy


class SunoSongGeneratorStrategy(SongGeneratorStrategy):
    """
    Online strategy that integrates with SunoApi.org.
    Requires SUNO_API_KEY to be configured in Django settings.
    """

    GENERATE_URL = "https://api.sunoapi.org/api/v1/generate"
    RECORD_INFO_URL = "https://api.sunoapi.org/api/v1/generate/record-info"

    def _get_headers(self):
        """Builds the Authorization header using the configured API key."""
        token = getattr(settings, 'SUNO_API_KEY', '')
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def generate(self, song_profile) -> str:
        """
        Calls POST /api/v1/generate to create a generation task on Suno.
        Constructs a prompt from the SongProfile fields.
        """
        prompt = (
            f"A {song_profile.mood.lower()} {song_profile.genre.lower()} song "
            f"for a {song_profile.occasion.lower()} with "
            f"{song_profile.vocal_selection.lower()} vocals."
        )

        payload = {
            "prompt": prompt,
            "title": song_profile.song.title,
            "make_instrumental": song_profile.vocal_selection == "INSTRUMENTAL",
            "wait_audio": False,
        }

        response = requests.post(
            self.GENERATE_URL,
            headers=self._get_headers(),
            json=payload,
        )
        response.raise_for_status()

        data = response.json()

        # Extract taskId from whichever key the API uses
        task_id = (
            data.get('taskId')
            or data.get('id')
            or data.get('data', {}).get('taskId')
        )

        if not task_id:
            raise ValueError(f"Suno API did not return a taskId. Response: {data}")

        return str(task_id)

    def check_status(self, task_id: str) -> dict:
        """
        Calls GET /api/v1/generate/record-info to poll generation status.
        """
        params = {"taskId": task_id}
        response = requests.get(
            self.RECORD_INFO_URL,
            headers=self._get_headers(),
            params=params,
        )
        response.raise_for_status()

        data = response.json()

        status_value = data.get('status', 'PENDING')
        audio_url = None

        if status_value in ('SUCCESS', 'READY'):
            audio_url = (
                data.get('audio_url')
                or data.get('data', {}).get('audioUrl')
            )

        return {
            "status": status_value,
            "audio_url": audio_url,
            "raw_response": data,
        }
