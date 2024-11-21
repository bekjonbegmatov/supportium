from django.db import models
from django.utils.translation import gettext_lazy as _


# Роли пользователей
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name=_("Role Name"))
    description = models.TextField(blank=True, verbose_name=_("Description"))

    class Meta:
        verbose_name = _("Role")
        verbose_name_plural = _("Roles")

    def __str__(self):
        return self.name


# Пользователи
class Users(models.Model):
    email = models.EmailField(max_length=254, unique=True, verbose_name=_("Email"))
    first_name = models.CharField(max_length=50, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=50, verbose_name=_("Last Name"))
    password = models.CharField(max_length=128, verbose_name=_("Password"))
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, verbose_name=_("Role"))
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))
    is_staff = models.BooleanField(default=False, verbose_name=_("Is Staff"))  # Добавьте это

    class Meta:
        verbose_name = _("Users")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.email


# Сессии
class Session(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, verbose_name=_("Users"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    session_token = models.CharField(max_length=255, unique=True, verbose_name=_("Session Token"))

    class Meta:
        verbose_name = _("Session")
        verbose_name_plural = _("Sessions")

    def __str__(self):
        return f"Session for {self.user.email}"


# Категории обращений
class RequestCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name=_("Category Name"))
    description = models.TextField(blank=True, verbose_name=_("Description"))

    class Meta:
        verbose_name = _("Request Category")
        verbose_name_plural = _("Request Categories")

    def __str__(self):
        return self.name


# Обращения
class Request(models.Model):
    class RequestStatus(models.TextChoices):
        PENDING = "PENDING", _("Pending")
        IN_PROGRESS = "IN_PROGRESS", _("In Progress")
        RESOLVED = "RESOLVED", _("Resolved")
        CLOSED = "CLOSED", _("Closed")

    user = models.ForeignKey(Users, on_delete=models.CASCADE, verbose_name=_("User"))
    category = models.ForeignKey(RequestCategory, on_delete=models.SET_NULL, null=True, verbose_name=_("Category"))
    description = models.TextField(verbose_name=_("Description"))
    status = models.CharField(
        max_length=20,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING,
        verbose_name=_("Status")
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Request")
        verbose_name_plural = _("Requests")

    def __str__(self):
        return f"Request #{self.id} by {self.user.email}"


# Вложения к обращениям
class RequestAttachment(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="attachments", verbose_name=_("Request"))
    file = models.FileField(upload_to="attachments/", verbose_name=_("File"))
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Uploaded At"))

    class Meta:
        verbose_name = _("Request Attachment")
        verbose_name_plural = _("Request Attachments")

    def __str__(self):
        return f"Attachment for Request #{self.request.id}"


# Чат
class ChatMessage(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="messages", verbose_name=_("Request"))
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="sent_messages", verbose_name=_("Sender"))
    recipient = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="received_messages", verbose_name=_("Recipient"))
    message = models.TextField(verbose_name=_("Message"))
    sent_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Sent At"))
    attachment = models.FileField(upload_to="chat_attachments/", null=True, blank=True, verbose_name=_("Attachment"))

    class Meta:
        verbose_name = _("Chat Message")
        verbose_name_plural = _("Chat Messages")

    def __str__(self):
        return f"Message from {self.sender.email} to {self.recipient.email}"

class AIChat(models.Model):
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="messages", verbose_name=_("Request"))
    message = models.TextField(verbose_name=_("Message"))
    role = models.CharField(verbose_name=_("Message"), max_length=50)
    sent_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Sent At"))
    
    class Meta:
        verbose_name = _("Ai Chat Message")
        verbose_name_plural = _("Ai Chat Messages")
        
    
    