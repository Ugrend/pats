import json
from fastapi import APIRouter, Request
from os.path import exists

from sqlmodel import select

from patserver.database import get_session
from patserver.models import Player, EmoteAudit
from patserver.models.notification import Notification
from patserver.views.notifications import publish_notification
from loguru import logger

DEFAULT_STATE = {}
CURRENT_STATE: dict | None = None

router = APIRouter(tags=["pat"])


def save():
    with open('pats.json', 'w') as f:
        json.dump(CURRENT_STATE, f)


def load_state():
    global CURRENT_STATE
    if exists("pats.json"):
        with open("pats.json", 'r') as f:
            CURRENT_STATE = json.load(f)
    else:
        CURRENT_STATE = json.loads(json.dumps(DEFAULT_STATE))
        save()


@router.get("")
async def get_stats():
    if CURRENT_STATE is None:
        load_state()
    return CURRENT_STATE


@router.post("")
async def apply_pat(request: Request):
    if CURRENT_STATE is None:
        load_state()
    body = await request.body()
    parsed = body.decode("utf-8")
    player, emoter, world, emote = parsed.split(",")
    player, player_world = player.split("@")
    emoter, emoter_world = emoter.split("@")
    logger.info(player)
    logger.info(emoter)

    with get_session() as session:
        player_obj = session.exec(select(Player).where(Player.name == player and Player.server == player_world)).first()
        emoter_obj = session.exec(select(Player).where(Player.name == emoter and Player.server == emoter_world)).first()

        if player_obj is None:
            player_obj = Player(name=player, server=player_world).set_lodestone_id().set_profile_uris()
            logger.info(player_obj)
            session.add(player_obj)
            session.commit()
        if emoter_obj is None:
            emoter_obj = Player(name=emoter, server=emoter_world).set_lodestone_id().set_profile_uris()
            session.add(emoter_obj)
            session.commit()

        audit = EmoteAudit(source_player_id=emoter_obj.id, target_player_id=player_obj.id, emote=emote, location=world)
        session.add(audit)
        session.commit()
        session.refresh(audit)
        session.refresh(player_obj)
        session.refresh(emoter_obj)
        publish_notification(Notification(
            id=audit.id,
            player=player_obj,
            emoter=emoter_obj,
            emote=emote,
            location=world,
            date=audit.date
        ))

        existing_char = CURRENT_STATE.get(str(player_obj.id), {
            "players": {}
        })
        existing_emoter = existing_char["players"].get(str(emoter_obj.id), {})
        existing_char[f"total_{emote}s"] = existing_char.get(f"total_{emote}s", 0) + 1
        existing_emoter[f"total_{emote}s"] = existing_emoter.get(f"total_{emote}s", 0) + 1
        existing_char["players"][str(emoter_obj.id)] = existing_emoter
        CURRENT_STATE[str(player_obj.id)] = existing_char
        save()
    return "Ok"
