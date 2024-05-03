from flask import current_app as app
from celery.schedules import crontab
from .tasks import daily_reminder
from .worker import celery_init_app

celery =celery_init_app(app)

