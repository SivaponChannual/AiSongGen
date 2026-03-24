"""
generator/serializers/user_serializer.py
ModelSerializer for the User domain model.
"""
from rest_framework import serializers
from generator.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
