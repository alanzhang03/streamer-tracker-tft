from celery_worker import celery_app

@celery_app.task
def update_data_task(user):
    from app import updateData  # import inside to avoid circular imports
    updateData(user)
