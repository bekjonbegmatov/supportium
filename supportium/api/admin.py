from django.contrib import admin
from .models import Role, Users, Session, RequestCategory, Request, RequestAttachment, ChatMessage

# Регистрируем модель Role
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)


# Регистрируем модель Users
@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'role')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


# Регистрируем модель Session
@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'session_token', 'created_at')
    search_fields = ('user__email', 'session_token')
    ordering = ('-created_at',)


# Регистрируем модель RequestCategory
@admin.register(RequestCategory)
class RequestCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)


# Регистрируем модель Request
@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'category')
    search_fields = ('user__email', 'description')
    ordering = ('-created_at',)


# Регистрируем модель RequestAttachment
@admin.register(RequestAttachment)
class RequestAttachmentAdmin(admin.ModelAdmin):
    list_display = ('request', 'file', 'uploaded_at')
    search_fields = ('request__id',)
    ordering = ('-uploaded_at',)


# Регистрируем модель ChatMessage
@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('request', 'sender', 'recipient', 'message', 'sent_at')
    search_fields = ('sender__email', 'recipient__email', 'message')
    ordering = ('-sent_at',)
