from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field, model_validator

EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class ReservationCreate(BaseModel):
    space_id: int
    requester_name: str = Field(min_length=1, max_length=100)
    requester_email: str = Field(pattern=EMAIL_PATTERN, min_length=1, max_length=150)
    reservation_date: date
    start_time: time
    end_time: time

    @model_validator(mode="after")
    def check_time(self):
        if self.start_time >= self.end_time:
            raise ValueError("start_time must be before end_time")
        return self


class ReservationUpdate(BaseModel):
    requester_name: str | None = Field(default=None, min_length=1, max_length=100)
    requester_email: str | None = Field(
        default=None, pattern=EMAIL_PATTERN, min_length=1, max_length=150
    )
    reservation_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None


class ReservationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    space_id: int
    requester_name: str
    requester_email: str
    reservation_date: date
    start_time: time
    end_time: time
    status: str
    created_at: datetime
