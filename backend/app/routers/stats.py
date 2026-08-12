from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/stats", tags=["stats"])

WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


@router.get("", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db)):
    resources = db.scalars(select(models.Resource)).all()
    bookings = db.scalars(select(models.Booking)).all()

    total_resources = len(resources)
    active_resources = sum(1 for r in resources if r.status == "active")
    total_bookings = len(bookings)

    status_counts = Counter(b.status for b in bookings)
    confirmed = status_counts.get("confirmed", 0)
    pending = status_counts.get("pending", 0)
    rejected = status_counts.get("rejected", 0)

    confirmation_rate = round(confirmed / total_bookings * 100) if total_bookings else 0

    resource_by_id = {r.id: r for r in resources}
    booking_counts = Counter(b.resource_id for b in bookings)
    popular_resources = [
        {"resourceId": rid, "name": resource_by_id[rid].name if rid in resource_by_id else "Неизвестно", "count": count}
        for rid, count in booking_counts.most_common(5)
    ]

    resources_by_type = {t: sum(1 for r in resources if r.type == t) for t in ("room", "person", "equipment")}

    weekday_counts = Counter(b.date.strftime("%a").lower() for b in bookings)
    bookings_by_weekday = {day: weekday_counts.get(day, 0) for day in WEEKDAYS}

    return schemas.StatsOut(
        total_resources=total_resources,
        active_resources=active_resources,
        total_bookings=total_bookings,
        pending_bookings=pending,
        confirmed_bookings=confirmed,
        rejected_bookings=rejected,
        confirmation_rate=confirmation_rate,
        popular_resources=popular_resources,
        resources_by_type=resources_by_type,
        bookings_by_weekday=bookings_by_weekday,
    )