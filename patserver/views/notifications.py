from fastapi import APIRouter

from patserver.models.notification import Notification
from datetime import timedelta, datetime

router = APIRouter(tags=["notification"])

NOTIFICATION_STATE: list[Notification] = []


def publish_notification(notification: Notification):
    global NOTIFICATION_STATE
    NOTIFICATION_STATE = [x for x in NOTIFICATION_STATE if x.date > datetime.now() - timedelta(seconds=5)]
    NOTIFICATION_STATE.append(notification)


@router.get("", response_model=list[Notification])
def get_notifications():
    global NOTIFICATION_STATE
    NOTIFICATION_STATE = [x for x in NOTIFICATION_STATE if x.date > datetime.now() - timedelta(seconds=5)]
    return NOTIFICATION_STATE
