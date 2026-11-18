from __future__ import annotations

from datetime import date, time

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.reservation import Reservation, ReservationStatus


class ReservationRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(
        self,
        space_id: int | None = None,
        reservation_date: date | None = None,
        status: str | None = None,
        requester_email: str | None = None,
    ) -> list[Reservation]:
        stmt = select(Reservation)
        if space_id is not None:
            stmt = stmt.where(Reservation.space_id == space_id)
        if reservation_date is not None:
            stmt = stmt.where(Reservation.reservation_date == reservation_date)
        if status:
            stmt = stmt.where(Reservation.status == status)
        if requester_email:
            stmt = stmt.where(Reservation.requester_email == requester_email)
        stmt = stmt.order_by(Reservation.reservation_date, Reservation.start_time)
        return list(self.db.scalars(stmt))

    def get(self, reservation_id: int) -> Reservation | None:
        return self.db.get(Reservation, reservation_id)

    def add(self, reservation: Reservation) -> Reservation:
        self.db.add(reservation)
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def save(self, reservation: Reservation) -> Reservation:
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def find_conflicts(
        self,
        space_id: int,
        reservation_date: date,
        start_time: time,
        end_time: time,
        exclude_id: int | None = None,
    ) -> list[Reservation]:
        """Reservas ativas do mesmo espaço/dia cujo intervalo se sobrepõe.

        Dois intervalos [a, b) e [c, d) se sobrepõem se a < d e c < b.
        Canceladas são ignoradas (regra 4).
        """
        stmt = select(Reservation).where(
            Reservation.space_id == space_id,
            Reservation.reservation_date == reservation_date,
            Reservation.status != ReservationStatus.CANCELLED.value,
            Reservation.start_time < end_time,
            Reservation.end_time > start_time,
        )
        if exclude_id is not None:
            stmt = stmt.where(Reservation.id != exclude_id)
        return list(self.db.scalars(stmt))
