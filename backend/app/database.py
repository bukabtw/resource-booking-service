from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings

# Для SQLite требуется check_same_thread=False, т.к. FastAPI работает в потоках
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Зависимость FastAPI, предоставляющая сессию БД на время запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
