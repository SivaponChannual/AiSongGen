"""
generator/services/strategy.py
Defines the abstract Strategy interface for song generation.
"""
from abc import ABC, abstractmethod


class SongGeneratorStrategy(ABC):
    """
    Abstract base class defining the Strategy interface.
    All concrete strategies must implement generate() and check_status().
    """

    @abstractmethod
    def generate(self, song_profile) -> str:
        """
        Initiates the song generation process.

        Args:
            song_profile: A SongProfile instance with generation parameters.

        Returns:
            str: A task ID or reference to track the generation job.
        """
        pass

    @abstractmethod
    def check_status(self, task_id: str) -> dict:
        """
        Checks the status of an ongoing generation task.

        Args:
            task_id: The tracking ID returned by generate().

        Returns:
            dict: Keys include 'status' (e.g. PENDING, SUCCESS)
                  and 'audio_url' (if generation completed).
        """
        pass
