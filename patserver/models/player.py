from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime
import requests


class Player(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    server: str
    lodestone_id: Optional[int]
    avatar_uri: str
    portrait_uri: str
    first_seen: datetime = Field(default_factory=datetime.now)
    last_updated: datetime = Field(default_factory=datetime.now)

    def set_lodestone_id(self):
        r = requests.get("https://api.kalilistic.io/v1/lodestone/player",
                         params={
                             "playerName": self.name,
                             "worldName": self.server
                         })
        if r.status_code == 200:
            self.lodestone_id = r.json()["lodestoneId"]
        return self

    def set_profile_uris(self):
        if self.lodestone_id is None:
            self.set_lodestone_id()
        r = requests.get(f"https://xivapi.com/character/{self.lodestone_id}")
        if r.status_code == 200:
            result = r.json()
            self.portrait_uri = result["Character"]["Portrait"]
            self.avatar_uri = result["Character"]["Avatar"]
        return self


