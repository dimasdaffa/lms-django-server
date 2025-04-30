# views.py
from django.http import JsonResponse
from django.core import serializers
from django.db.models import Max, Min, Avg, Count
from django.contrib.auth.models import User
from .models import Course, CourseMember, CourseContent
from django.views.decorators.csrf import csrf_exempt  
import json


def testing(request):
    user_test = User.objects.filter(username="usertesting")
    if not user_test.exists():
        user_test = User.objects.create_user(
            username="usertesting",
            email="usertest@email.com",
            password="sanditesting"
        )
    
    all_users = serializers.serialize('python', User.objects.all())
    admin = User.objects.get(pk=1)
    user_test.delete()
    after_delete = serializers.serialize('python', User.objects.all())
    
    response = {
        "admin_user": serializers.serialize('python', [admin])[0],
        "all_users": all_users,
        "after_del": after_delete,
    }
    return JsonResponse(response)

def allCourse(request):
    allCourse = Course.objects.all()
    result = []
    for course in allCourse:
        record = {
            'id': course.id,
            'name': course.name,
            'description': course.description,
            'price': course.price,
            'teacher': {
                'id': course.teacher.id,
                'username': course.teacher.username,
                'email': course.teacher.email,
                'fullname': f"{course.teacher.first_name} {course.teacher.last_name}"
            }
        }
        result.append(record)
    return JsonResponse(result, safe=False)

def userCourses(request):
    user = User.objects.get(pk=3)
    courses = Course.objects.filter(teacher=user.id)
    course_data = []
    for course in courses:
        record = {
            'id': course.id,
            'name': course.name,
            'description': course.description,
            'price': course.price
        }
        course_data.append(record)
    
    result = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'fullname': f"{user.first_name} {user.last_name}",
        'courses': course_data
    }
    return JsonResponse(result, safe=False)

def courseStat(request):
    courses = Course.objects.all()
    stats = courses.aggregate(
        max_price=Max('price'),
        min_price=Min('price'),
        avg_price=Avg('price')
    )
    
    cheapest = Course.objects.filter(price=stats['min_price'])
    expensive = Course.objects.filter(price=stats['max_price'])
    popular = Course.objects.annotate(
        member_count=Count('coursemember')
    ).order_by('-member_count')[:5]
    
    result = {
        'course_count': len(courses),
        'courses': stats,
        'cheapest': serializers.serialize('python', cheapest),
        'expensive': serializers.serialize('python', expensive),
        'popular': serializers.serialize('python', popular),
    }
    return JsonResponse(result, safe=False)
# views.py

def courseMemberStat(request):
    # Update the query to use the correct field names from your models
    courses = Course.objects.filter(description__icontains='python') \
        .annotate(member_num=Count('coursemember')) \
        .values('id', 'name', 'price', 'member_num')
    
    course_data = []
    for course in courses:
        record = {
            'id': course['id'],
            'name': course['name'],
            'price': course['price'],
            'member_count': course['member_num']
        }
        course_data.append(record)
    
    result = {
        'data_count': len(course_data),
        'data': course_data
    }
    return JsonResponse(result)


def courseDetail(request, course_id):
    # Menggunakan select_related untuk mengurangi query
    course = Course.objects.select_related('teacher').annotate(
        member_count=Count('coursemember'),
        content_count=Count('coursecontent'),
        comment_count=Count('coursecontent__comment')
    ).get(pk=course_id)
    
    # Menggunakan prefetch_related untuk konten dan komentar
    contents = CourseContent.objects.filter(
        course_id=course.id
    ).prefetch_related('comment').annotate(
        count_comment=Count('comment')
    ).order_by('-count_comment')[:3]
    
    result = {
        "name": course.name,
        'description': course.description,
        'price': course.price,
        'member_count': course.member_count,
        'content_count': course.content_count,
        'teacher': {
            'username': course.teacher.username,
            'email': course.teacher.email,
            'fullname': course.teacher.first_name
        },
        'comment_stat': {
            'comment_count': course.comment_count,
            'most_comment': [{
                'name': content.name,
                'comment_count': content.count_comment
            } for content in contents]
        },
    }
    return JsonResponse(result)
@csrf_exempt
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            })
        return JsonResponse(user_data, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data.get('password', 'defaultpassword'),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', '')
            )
            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def user_detail(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })

    elif request.method == 'PUT':
        data = json.loads(request.body)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save()
        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })

    elif request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'User deleted successfully'})

@csrf_exempt
def delete_all_courses(request):
    if request.method == 'DELETE':
        from core.models import Course
        Course.objects.all().delete()
        return JsonResponse({'message': 'All courses deleted successfully'})
