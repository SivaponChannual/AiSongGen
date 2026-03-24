"""
generator/serializers/song_serializer.py
ModelSerializer for the Song domain model.
"""
from rest_framework import serializers
from generator.models import Song


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'
