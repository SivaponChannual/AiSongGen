"""
generator/api/auth.py
Handles Google OAuth2 login via an ID token provided by the frontend.
"""
import logging
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from generator.models import User, MediaLibrary
from generator.serializers import UserSerializer

logger = logging.getLogger(__name__)

class GoogleLoginView(APIView):
    """
    POST /api/auth/google/
    Accepts: { "id_token": "..." }
    Returns: User profile data + basic session info.
    """
    authentication_classes = [] # No auth required to login
    permission_classes = []

    def post(self, request):
        token = request.data.get('id_token')
        if not token:
            return Response({'error': 'id_token is required'}, status=status.HTTP_400_BAD_REQUEST)

        client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
        if not client_id:
            logger.error("GOOGLE_CLIENT_ID not configured in settings")
            return Response({'error': 'Server misconfiguration'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # Verify the token against Google
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            
            google_id = idinfo['sub']
            email = idinfo.get('email')

            # Get or create the User
            user, created = User.objects.get_or_create(
                google_id=google_id,
                defaults={'user_email': email}
            )

            # Ensure MediaLibrary exists
            MediaLibrary.objects.get_or_create(user=user)

            # Return serialized user
            serializer = UserSerializer(user)
            return Response({
                'message': 'Login successful',
                'user': serializer.data,
                'is_new': created
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"Invalid Google token: {e}")
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
