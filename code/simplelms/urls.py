"""
URL configuration for simplelms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from core import views
from core.apiv1 import api

urlpatterns = [
    path('silk/', include('silk.urls'), name='silk'),
    path('admin/', admin.site.urls),
    path('testing/', views.testing, name='testing'),
    path('api/courses/', views.allCourse, name='all_courses'),
    path('api/user-courses/', views.userCourses, name='user_courses'),
    path('api/course-stats/', views.courseStat, name='course_stats'),
    path('api/member-stats/', views.courseMemberStat, name='member_stats'),
    path('api/users/', views.user_list, name='user_list'),
    path('api/users/<int:user_id>/', views.user_detail, name='user_detail'),
    path('api/courses/delete-all/', views.delete_all_courses, name='delete_all_courses'),
    path('api/v1/', api.urls),
]
