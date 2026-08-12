from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("", response_model=list[schemas.ResourceOut])
def list_resources(db: Session = Depends(get_db)):
    return db.scalars(select(models.Resource).order_by(models.Resource.id)).all()


@router.post("", response_model=schemas.ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(payload: schemas.ResourceCreate, db: Session = Depends(get_db)):
    resource = models.Resource(**payload.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.get("/{resource_id}", response_model=schemas.ResourceOut)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.get(models.Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Ресурс не найден")
    return resource


@router.put("/{resource_id}", response_model=schemas.ResourceOut)
def update_resource(resource_id: int, payload: schemas.ResourceUpdate, db: Session = Depends(get_db)):
    resource = db.get(models.Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Ресурс не найден")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(resource, field, value)
    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.get(models.Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Ресурс не найден")

    has_bookings = db.scalar(
        select(models.Booking.id).where(
            models.Booking.resource_id == resource_id,
            models.Booking.status != "rejected",
        ).limit(1)
    )
    if has_bookings:
        raise HTTPException(
            status_code=409,
            detail="Нельзя удалить ресурс с активными бронированиями",
        )

    db.delete(resource)
    db.commit()