from django.urls import path, include
from . import views
from rest_framework import routers
from task.views import TaskViewSet

app_name = 'task'

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('index', views.index, name='index')
]