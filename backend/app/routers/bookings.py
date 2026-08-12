from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/bookings", tags=["bookings"])


def _has_conflict(db: Session, resource_id: int, booking_date: date,
                  start_time: str, end_time: str, exclude_id: int | None = None) -> bool:
    """Проверяет пересечение интервалов времени у активных броней ресурса."""
    query = select(models.Booking).where(
        models.Booking.resource_id == resource_id,
        models.Booking.date == booking_date,
        models.Booking.status != "rejected",
    )
    if exclude_id is not None:
        query = query.where(models.Booking.id != exclude_id)

    for booking in db.scalars(query):
        if start_time < booking.end_time and end_time > booking.start_time:
            return True
    return False


@router.get("", response_model=list[schemas.BookingOut])
def list_bookings(
    resource_id: int | None = Query(default=None),
    date: date | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    query = select(models.Booking).order_by(models.Booking.date, models.Booking.start_time)
    if resource_id is not None:
        query = query.where(models.Booking.resource_id == resource_id)
    if date is not None:
        query = query.where(models.Booking.date == date)
    if status_filter is not None:
        query = query.where(models.Booking.status == status_filter)
    return db.scalars(query).all()


@router.post("", response_model=schemas.BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: schemas.BookingCreate, db: Session = Depends(get_db)):
    if not db.get(models.Resource, payload.resource_id):
        raise HTTPException(status_code=404, detail="Ресурс не найден")
    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=422, detail="Время окончания должно быть позже начала")

    if _has_conflict(db, payload.resource_id, payload.date, payload.start_time, payload.end_time):
        raise HTTPException(status_code=409, detail="Конфликт! Ресурс уже занят в это время")

    booking = models.Booking(
        **payload.model_dump(),
        status="pending",
        created_at=datetime.now(),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/{booking_id}", response_model=schemas.BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return booking


@router.put("/{booking_id}", response_model=schemas.BookingOut)
def update_booking(booking_id: int, payload: schemas.BookingUpdate, db: Session = Depends(get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    data = payload.model_dump(exclude_unset=True)
    if "resource_id" in data and data["resource_id"] is not None and not db.get(models.Resource, data["resource_id"]):
        raise HTTPException(status_code=404, detail="Ресурс не найден")

    new_start = data.get("start_time", booking.start_time)
    new_end = data.get("end_time", booking.end_time)
    if new_end <= new_start:
        raise HTTPException(status_code=422, detail="Время окончания должно быть позже начала")

    if _has_conflict(
        db,
        data.get("resource_id", booking.resource_id),
        data.get("date", booking.date),
        new_start,
        new_end,
        exclude_id=booking.id,
    ):
        raise HTTPException(status_code=409, detail="Конфликт! Ресурс уже занят в это время")

    for field, value in data.items():
        setattr(booking, field, value)
    db.commit()
    db.refresh(booking)
    return booking


@router.patch("/{booking_id}/status", response_model=schemas.BookingOut)
def update_booking_status(booking_id: int, payload: schemas.BookingStatusUpdate, db: Session = Depends(get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    db.delete(booking)
    db.commit()