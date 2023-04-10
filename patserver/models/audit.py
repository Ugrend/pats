from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime


class EmoteAudit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source_player_id: int = Field(
        default=None, foreign_key="player.id", nullable=False
    )
    target_player_id: int = Field(
        default=None, foreign_key="player.id", nullable=False
    )
    emote: str
    location: str
    date: datetime = Field(default_factory=datetime.now)
