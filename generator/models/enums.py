"""
generator/models/enums.py
All TextChoices enumerations for the domain layer.
"""
from django.db import models


class Genre(models.TextChoices):
    POP = 'POP', 'Pop'
    J_POP = 'J_POP', 'J-Pop'
    JDM = 'JDM', 'JDM'
    ROCK = 'ROCK', 'Rock'
    ELECTRONIC = 'ELECTRONIC', 'Electronic'


class Mood(models.TextChoices):
    ENERGETIC = 'ENERGETIC', 'Energetic'
    CALMING = 'CALMING', 'Calming'
    UPBEAT = 'UPBEAT', 'Upbeat'
    SAD = 'SAD', 'Sad'
    DREAMY = 'DREAMY', 'Dreamy'


class Occasion(models.TextChoices):
    WORKOUT = 'WORKOUT', 'Workout'
    STUDY = 'STUDY', 'Study'
    PARTY = 'PARTY', 'Party'
    COMMUTE = 'COMMUTE', 'Commute'


class VocalType(models.TextChoices):
    MALE = 'MALE', 'Male'
    FEMALE = 'FEMALE', 'Female'
    INSTRUMENTAL = 'INSTRUMENTAL', 'Instrumental'


class GenerationStatus(models.TextChoices):
    GENERATING = 'GENERATING', 'Generating'
    READY = 'READY', 'Ready'
    FAILED = 'FAILED', 'Failed'
