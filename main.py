from flask import Flask
from config import DevelopmentConfig
from backend.sec import datastore
from backend.models import db
from flask_security import Security
from backend.resources import api
from backend.worker import celery_init_app
from celery.schedules import crontab
from backend.tasks import daily_reminder,monthly_activity_report
from backend.instances import cache
import flask_excel as excel
def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    app.security=Security(app,datastore)
    api.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)
    with app.app_context():
        import backend.views
        cache.clear()
    return app

app=create_app()
celery_app=celery_init_app(app)

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=11, minute=42),
        daily_reminder.s("Daily Reminder"),
    )
    sender.add_periodic_task(
        crontab(hour=11, minute=42,day_of_month=30),
       monthly_activity_report.s("Monthly Activity Report"),
    )


if __name__=='__main__':
    app.run(debug=True)