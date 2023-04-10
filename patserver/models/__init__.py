from .audit import EmoteAudit
from .player import Player
from sqlmodel import SQLModel

from ..database import engine

SQLModel.metadata.create_all(engine)
__all__ = [
    "EmoteAudit",
    "Player"
]
