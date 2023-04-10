from sqlmodel import create_engine, Session

from patserver.settings import settings

engine = create_engine(settings.db.dsn.get_secret_value())


def get_session() -> Session:
    with Session(engine) as session:
        return session