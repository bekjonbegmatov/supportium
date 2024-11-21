from django.urls import path
from . import views

from .views import RegisterView, LoginView, LogoutView

urlpatterns = [
    path('', views.get_routes),
    
    # Auth 
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('chat/ai/', )
]
