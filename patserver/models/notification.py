from pydantic import BaseModel
from datetime import datetime
from patserver.models import Player


class Notification(BaseModel):
    id: int
    player: Player
    emoter: Player
    emote: str
    location: str
    total_player: int
    total_emoter: int
    date: datetime
