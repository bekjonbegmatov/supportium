# middleware.py
from django.utils.deprecation import MiddlewareMixin
from .models import Session

class TokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.headers.get("Authorization")
        if token:
            session = Session.objects.filter(session_token=token).first()
            if session:
                request.user = session.user
            else:
                request.user = None
        else:
            request.user = None
