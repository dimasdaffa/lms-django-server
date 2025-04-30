from django.contrib import admin
from .models import Course
from .models import CourseMember
from .models import CourseContent
from .models import Comment


# Register your models here.
admin.site.register(Course)
admin.site.register(CourseMember)
admin.site.register(CourseContent)
admin.site.register(Comment)