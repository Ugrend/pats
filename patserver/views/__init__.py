from fastapi import APIRouter
from patserver.views import (
    audit,
    notifications,
    pat,
    player
)

api_router = APIRouter()

api_router.include_router(audit.router, prefix="/audit")
api_router.include_router(notifications.router, prefix="/notifications")
api_router.include_router(pat.router, prefix="/pat")
api_router.include_router(player.router, prefix="/player")