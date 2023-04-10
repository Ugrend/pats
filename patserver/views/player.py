from typing import Optional

from fastapi import APIRouter
from sqlmodel import select

from patserver.database import get_session
from patserver.models import Player

router = APIRouter(tags=["player"])


@router.get("", response_model=list[Player])
def get_players():
    with get_session() as session:
        return session.exec(select(Player)).all()


@router.get("/{player_id}", response_model=Optional[Player])
def get_player(player_id: int) -> Optional[Player]:
    with get_session() as session:
        return session.exec(select(Player).where(Player.id == player_id)).first()
