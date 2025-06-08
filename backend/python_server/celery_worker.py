from celery import Celery
import os

celery_app = Celery(
    'tasks',
    broker=os.environ.get('REDISCLOUD_URL', 'redis://localhost:6379/0')
)