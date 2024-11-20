# Django Imports
from django.shortcuts import render

# Rest Framework 
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Custom Models Import 
from api.consts import routes
# get routes/methods
@api_view(['GET'])
def get_routes(request):
    
    return Response(routes)