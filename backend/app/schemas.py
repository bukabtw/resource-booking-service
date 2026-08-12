from datetime import date as date_type, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

ResourceType = Literal["room", "person", "equipment"]
ResourceStatus = Literal["active", "inactive"]
BookingStatus = Literal["pending", "confirmed", "rejected"]

camel_config = ConfigDict(from_attributes=True, alias_generator=to_camel, populate_by_name=True)


class ResourceBase(BaseModel):
    model_config = camel_config

    name: str = Field(min_length=1, max_length=200)
    type: ResourceType
    capacity: int = Field(default=1, ge=1)
    responsible: str = Field(default="", max_length=200)
    status: ResourceStatus = "active"


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    model_config = camel_config

    name: str | None = Field(default=None, min_length=1, max_length=200)
    type: ResourceType | None = None
    capacity: int | None = Field(default=None, ge=1)
    responsible: str | None = Field(default=None, max_length=200)
    status: ResourceStatus | None = None


class ResourceOut(ResourceBase):
    id: int


class BookingBase(BaseModel):
    model_config = camel_config

    resource_id: int
    title: str = Field(min_length=1, max_length=200)
    date: date_type
    start_time: str
    end_time: str
    participants: str = Field(default="", max_length=500)
    created_by: str = Field(default="", max_length=200)

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        try:
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise ValueError("Время должно быть в формате HH:MM")
        return v


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    model_config = camel_config

    resource_id: int | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    date: date_type | None = None
    start_time: str | None = None
    end_time: str | None = None
    participants: str | None = Field(default=None, max_length=500)
    created_by: str | None = Field(default=None, max_length=200)


class BookingStatusUpdate(BaseModel):
    model_config = camel_config

    status: BookingStatus


class BookingOut(BookingBase):
    id: int
    status: BookingStatus
    created_at: datetime


class StatsOut(BaseModel):
    model_config = camel_config

    total_resources: int
    active_resources: int
    total_bookings: int
    pending_bookings: int
    confirmed_bookings: int
    rejected_bookings: int
    confirmation_rate: int
    popular_resources: list[dict]
    resources_by_type: dict[str, int]
    bookings_by_weekday: dict[str, int]