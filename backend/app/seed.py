from datetime import date

from sqlalchemy.orm import Session

from . import models


def seed_data(db: Session) -> None:
    """Заполняет БД демо-данными, если таблицы пусты."""
    if db.query(models.Resource).count() > 0:
        return

    resources = [
        models.Resource(id=1, name="Конференц-зал А", type="room", capacity=20, responsible="Иван Петров", status="active"),
        models.Resource(id=2, name="Конференц-зал B", type="room", capacity=10, responsible="Анна Смирнова", status="active"),
        models.Resource(id=3, name="Переговорная С", type="room", capacity=6, responsible="Анна Смирнова", status="active"),
        models.Resource(id=4, name="Фотограф Дмитрий", type="person", capacity=1, responsible="Дмитрий Козлов", status="active"),
        models.Resource(id=5, name="Видеограф Мария", type="person", capacity=1, responsible="Мария Иванова", status="active"),
        models.Resource(id=6, name="Проектор Epson", type="equipment", capacity=1, responsible="Сергей Иванов", status="active"),
        models.Resource(id=7, name="Ноутбук для презентаций", type="equipment", capacity=1, responsible="Сергей Иванов", status="inactive"),
        models.Resource(id=8, name="Флипчарт", type="equipment", capacity=1, responsible="Ольга Соколова", status="active"),
    ]
    db.add_all(resources)

    bookings = [
        models.Booking(
            id=1, resource_id=1, title="Встреча отдела продаж", date=date(2026, 5, 15),
            start_time="10:00", end_time="12:00", participants="ivan@mail.ru, anna@mail.ru",
            status="confirmed", created_by="Кирилл Букарев", created_at=date(2026, 5, 10),
        ),
        models.Booking(
            id=2, resource_id=4, title="Фотосессия для маркетинга", date=date(2026, 5, 16),
            start_time="14:00", end_time="16:00", participants="dmitry@mail.ru",
            status="pending", created_by="Анна Смирнова", created_at=date(2026, 5, 11),
        ),
        models.Booking(
            id=3, resource_id=1, title="Совещание руководства", date=date(2026, 5, 15),
            start_time="14:00", end_time="16:00", participants="boss@mail.ru",
            status="confirmed", created_by="Кирилл Букарев", created_at=date(2026, 5, 10),
        ),
        models.Booking(
            id=4, resource_id=6, title="Презентация проекта", date=date(2026, 5, 17),
            start_time="11:00", end_time="13:00", participants="team@mail.ru",
            status="pending", created_by="Сергей Иванов", created_at=date(2026, 5, 12),
        ),
    ]
    db.add_all(bookings)
    db.commit()