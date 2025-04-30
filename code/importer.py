import os
import sys
import csv
import json
from random import randint

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(__file__, *[os.pardir] * 3)))
os.environ['DJANGO_SETTINGS_MODULE'] = 'simplelms.settings'
import django
django.setup()

from django.contrib.auth.models import User
from core.models import Course, CourseMember, CourseContent, Comment

def import_users():
    with open('./csv_data/user-data.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for num, row in enumerate(reader):
            if not User.objects.filter(username=row['username']).exists():
                User.objects.create_user(
                    id=num+2,
                    username=row['username'],
                    password=row['password'],
                    email=row['email']
                )

def import_courses():
    with open('./csv_data/course-data.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        courses_to_create = []
        for num, row in enumerate(reader):
            if not Course.objects.filter(pk=num+1).exists():
                courses_to_create.append(Course(
                    id=num+1,
                    name=row['name'],
                    description=row['description'],
                    price=row['price'],
                    teacher=User.objects.get(pk=int(row['teacher']))
                ))
        Course.objects.bulk_create(courses_to_create)

if __name__ == "__main__":
    import_users()
    import_courses()