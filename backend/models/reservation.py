from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.space import Space
import enum
from datetime import date, datetime, time

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.session import Base


class ReservationStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    space_id: Mapped[int] = mapped_column(
        ForeignKey("spaces.id"), nullable=False, index=True
    )
    requester_name: Mapped[str] = mapped_column(String(100), nullable=False)
    requester_email: Mapped[str] = mapped_column(String(150), nullable=False)
    reservation_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), default=ReservationStatus.CONFIRMED.value, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    space: Mapped["Space"] = relationship(back_populates="reservations")
