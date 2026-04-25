"""
generator/services/factory.py
Centralized factory for selecting the active song generation strategy.
"""
from django.conf import settings
from .strategy import SongGeneratorStrategy
from .mock_strategy import MockSongGeneratorStrategy
from .suno_strategy import SunoSongGeneratorStrategy


class GeneratorFactory:
    """
    Factory that reads GENERATOR_STRATEGY from Django settings
    and returns the corresponding strategy instance.
    This is the single place where strategy selection is decided.
    """

    @staticmethod
    def get_generator() -> SongGeneratorStrategy:
        """
        Returns the appropriate strategy instance.

        Settings:
            GENERATOR_STRATEGY = 'mock' | 'suno'
        """
        strategy_name = getattr(settings, 'GENERATOR_STRATEGY', 'mock').lower()

        if strategy_name == 'suno':
            return SunoSongGeneratorStrategy()

        # Default to mock to prevent accidental external API calls
        return MockSongGeneratorStrategy()
