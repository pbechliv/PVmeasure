FROM python:3.7

WORKDIR /app

COPY . /app/

RUN pip install -r requirements.txt
RUN python manage.py makemigrations
RUN python manage.py migrate

EXPOSE 8002

CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]