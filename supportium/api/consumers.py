import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from asgiref.sync import sync_to_async

@sync_to_async(thread_sensitive=True)
def save_message_to_db(room_name, sender_email, recipient_email, message):
    from .models import ChatMessage, Users, Request  # Импорт внутри функции
    sender = Users.objects.get(email=sender_email)
    recipient = Users.objects.get(email=recipient_email)
    
    # Находим или создаем объект Request
    chat_request, created = Request.objects.get_or_create(
        id=room_name,  # room_name используется как ID Request
        defaults={
            'user': sender,  # Или другой пользователь, связанный с заявкой
            'description': f"Chat request for room {room_name}",
        }
    )
    
    # Создаем сообщение
    ChatMessage.objects.create(
        request=chat_request,
        sender=sender,
        recipient=recipient,
        message=message
    )

@sync_to_async(thread_sensitive=True)
def get_chat_history_from_db(room_name):
    from .models import ChatMessage  # Импорт внутри функции
    messages = ChatMessage.objects.filter(request_id=room_name).order_by('sent_at')
    return [
        {
            'sender': msg.sender.email,
            'recipient': msg.recipient.email,
            'message': msg.message,
            'timestamp': msg.sent_at.isoformat(),
        }
        for msg in messages
    ]


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Присоединяемся к группе
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Отправляем историю сообщений
        try:
            chat_history = await get_chat_history_from_db(self.room_name)
            await self.send(text_data=json.dumps({
                'type': 'chat_history',
                'messages': chat_history
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f"Failed to load chat history: {str(e)}"
            }))

    async def disconnect(self, close_code):
        # Отключаемся от группы
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            # Обработка входящих сообщений
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender_email = text_data_json['sender']
            recipient_email = text_data_json['recipient']

            # Сохраняем сообщение в базу данных
            await save_message_to_db(self.room_name, sender_email, recipient_email, message)

            # Отправляем сообщение группе
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender_email,
                    'recipient': recipient_email
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f"Failed to process message: {str(e)}"
            }))

    async def chat_message(self, event):
        # Отправляем сообщение в WebSocket
        message = event['message']
        sender = event['sender']
        recipient = event['recipient']

        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender': sender,
            'recipient': recipient
        }))
