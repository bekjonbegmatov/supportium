from django.urls import path
from . import views

from .views import RegisterView, LoginView, LogoutView, UserView, ChatWithAI, get_requests_category, ReqestsView

urlpatterns = [
    path('', views.get_routes),
    
    # Auth 
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('chat/ai/', )
    path('who/am/i/', UserView.as_view(), name="Who am I"),
    
    # chat_ai
    path('chat/with/ai/', ChatWithAI.as_view(), name="AICHAT"),

    path('category/', get_requests_category , name="get_category"), 
    path('user/request', ReqestsView.as_view(), name='CPGD for requests')      
]
