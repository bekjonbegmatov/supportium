# Django Imports
from django.shortcuts import render

# Rest Framework 
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer

# Custom Models Import 
from api.consts import routes
from .models import Users, Session

import uuid
import hashlib

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response({"message": "Registration successful", "token": data["token"]})
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        hashed_password = hashlib.md5(password.encode()).hexdigest()
        user = Users.objects.filter(email=email, password=hashed_password).first()

        if user:
            # Проверка существующей сессии
            session = Session.objects.filter(user=user).first()
            if not session:
                session_token = uuid.uuid4().hex
                Session.objects.create(user=user, session_token=session_token)
            else:
                session_token = session.session_token
            return Response({"message": "Login successful", "token": session_token})
        return Response({"message": "Invalid credentials"}, status=401)

class LogoutView(APIView):
    def post(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "No token provided"}, status=400)
        
        session = Session.objects.filter(session_token=token).first()
        if session:
            session.delete()
            return Response({"message": "Successfully logged out"})
        
        return Response({"error": "Invalid token"}, status=401)
    
class ChatAi(APIView):
    def post(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "No token provided"}, status=400)
        session = Session.objects.filter(session_token=token).first()
        user = Users.objects.get(id=session.user.id)
        
        
        
    
# get routes/methods
@api_view(['GET'])
def get_routes(request):
    return Response(routes)

