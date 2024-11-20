from rest_framework import serializers
from .models import Users, Request, ChatMessage, RequestCategory, Session
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import uuid

import hashlib

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = Users
        fields = ['email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = Users.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.password = hashlib.md5(validated_data['password'].encode()).hexdigest()
        user.save()

        # Генерация токена
        token = uuid.uuid4().hex
        Session.objects.create(user=user, session_token=token)
        return {"user": user, "token": token}

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ['id', 'user', 'category', 'description', 'status', 'created_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'request', 'sender', 'recipient', 'message', 'sent_at', 'attachment']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Получаем стандартный токен
        token = super().get_token(user)

        # Добавляем кастомные данные из вашей модели User
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name

        return token
    
    