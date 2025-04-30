FROM python:latest
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
RUN pip install django-cors-headers
RUN pip install django-silk==5.1.0
CMD ["sleep", "infinity"]