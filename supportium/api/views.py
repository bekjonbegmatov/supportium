import requests
import uuid
import hashlib
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from test import data
from .serializers import RegisterSerializer
from .models import Users, Session, AIChat, Request, RequestCategory,ChatMessage
from api.consts import routes
from django.shortcuts import get_object_or_404

from django.db.models import Case, When, IntegerField

# OpenAI API Config
API_KEY = "sk-0F553L14lPVPjEIEtix8uB6bWY8q4mLa"
URL = "https://api.proxyapi.ru/openai/v1/chat/completions"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
}


# Chat API Helper
def chat_api(context):
    # Инициализируем системное сообщение
    n_context = [
        {"role": "system", "content": '''Supportium AI — виртуальный помощник для студентов и сотрудников ВСГУТУ. Он отвечает только на вопросы, связанные с обучением и деятельностью университета. Бот предоставляет информацию о факультетах, кафедрах, расписании занятий, местоположении аудиторий и контактах преподавателей. Он помогает в подаче заявлений, уточняет тип документа (например, заявление на академический отпуск, восстановление, перевод) и сообщает, какие данные и документы нужно предоставить.
Бот также готов сгенерировать случайные данные (например, электронную почту) по запросу пользователя. Он не игнорирует предоставленные данные и точно выполняет запросы, связанные с учебным процессом и административными вопросами университета. Supportium AI ориентирован на быструю и удобную помощь в рамках учебных задач.
 И ещё старайся отвечать более коротко если есть такой необходимость потому что не надо большой текст писать Если есть возможность используй и напиши короткий ответ'''}
    ]

    # Объединяем системное сообщение с пользовательским контекстом
    n_context.extend(context)

    # Формируем данные для запроса
    data = {
        "model": "gpt-3.5-turbo",
        "messages": n_context
    }

    # Выполняем запрос к OpenAI API
    try:
        response = requests.post(URL, headers=HEADERS, json=data)
        if response.status_code == 200:
            response_json = response.json()
            return response_json.get("choices", [{}])[0].get("message", {}).get("content", "Ошибка обработки ответа.")
        else:
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"Error: {str(e)}"


# Register View
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response({"message": "Registration successful", "token": data["token"]})
        return Response(serializer.errors, status=400)

# Login View
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

# Logout View
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

# User View
class UserView(APIView):
    def get(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "No token provided"}, status=400)
        session = Session.objects.filter(session_token=token).first()
        if session:
            user = session.user
            data = {
                'email': user.email,
                'name': user.first_name,
                'last_name': user.last_name,
                'is_staff' : user.is_staff
            }
            return Response(data=data)
        
        return Response({"error": "Invalid token"}, status=401)

# Chat with AI View
class ChatWithAI(APIView):
    def get(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Bad request"}, status=400)
        session = Session.objects.filter(session_token=token).first()
        if session:
            user = session.user 
            user_chats = AIChat.objects.filter(sender=user)
            if len(user_chats) > 0:
                data = [
                    {
                        "role": chat.role,
                        "message": chat.message
                    } 
                    for chat in user_chats
                ]
            else:
                data = [
                    {
                        'role' : "assistant",
                        "message": 'Привет я Supportium Ai умный помощник что тебе надо ?'
                    },
                ]
            return Response(data=data)
        return Response({"error": "Invalid token"}, status=401) 
    
    def post(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "No token provided"}, status=400)
        
        context = request.data.get("context")
        if not context:
            return Response({"error": "No context provided"}, status=400)

        session = Session.objects.filter(session_token=token).first()
        if session:
            user = session.user
            
            # Формируем запрос к API
            formatted_context = [
                {"role": msg.get("role"), "content": msg.get("message")}
                for msg in context
            ]
            response_message = chat_api(formatted_context)
            
            # Сохранение сообщений в базе данных
            for msg in context:
                AIChat.objects.create(
                    sender=user,
                    role=msg["role"],
                    message=msg["message"]
                )
            AIChat.objects.create(
                sender=user,
                role="assistant",
                message=response_message
            )
            
            return Response({"assistant": response_message})
        
        return Response({"error": "Invalid token"}, status=401)


#! Requests

class ReqestsView(APIView):
    def get(self, request):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "No token provided"}, status=400)
        
        session = Session.objects.filter(session_token=token).first()
        if session:
            user = session.user

            # Создаем аннотацию для приоритета по статусу
            priority_annotation = Case(
                When(status=Request.RequestStatus.PENDING, then=1),
                When(status=Request.RequestStatus.IN_PROGRESS, then=2),
                When(status=Request.RequestStatus.RESOLVED, then=3),
                When(status=Request.RequestStatus.CLOSED, then=4),
                default=5,  # Низший приоритет
                output_field=IntegerField(),
            )

            if user.is_staff:
                user_requests = Request.objects.annotate(priority=priority_annotation).order_by('priority', 'created_at')
            else:
                user_requests = Request.objects.filter(user=user).annotate(priority=priority_annotation).order_by('priority', 'created_at')

            data = [
                {
                    'id': req.id,
                    'category': req.category.description,
                    'text': req.description,
                    'email': req.user.email,
                    'status': req.status,
                    'created': req.created_at,
                }
                for req in user_requests
            ]
            return Response(data=data)
        return Response({"error": "Invalid token"}, status=401)
    
    def post(self, request):
            token = request.headers.get("Authorization")
            if not token:
                return Response({"error": "No token provided"}, status=400)
            
            session = Session.objects.filter(session_token=token).first()
            if not session:
                return Response({"error": "Invalid token"}, status=401)
            

            data = request.data.get("data")
            if not data:
                return Response({"error": "Invalid payload"}, status=400)

            category_id = data.get("category")
            text = data.get("text")
            
            if not category_id or not text:
                return Response({"error": "Category and text are required"}, status=400)
            
            # Resolve the category_id to a RequestCategory instance
            category = get_object_or_404(RequestCategory, id=category_id)

            req = Request(
                user=session.user,
                category=category,  # Assign the resolved instance
                description=text,
                status='PENDING'
            )
            req.save()
            
            chat_message = ChatMessage(
                request = req,
                sender = session.user,
                recipient = Users.objects.get(email="behruz@b.ru"),
                message = text,
            )
            chat_message.save()
            return Response({"message": "Request created successfully"}, status=201)
    
@api_view(['GET'])
def get_requests_category(request):
    data = [
        {"id" : cat.id, "description" : cat.description}
        for cat in RequestCategory.objects.all()
    ]
    return Response(data=data)


# Get Routes
@api_view(['GET'])
def get_routes(request):
    return Response(routes)
