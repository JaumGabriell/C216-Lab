from sqlalchemy import select
from sqlalchemy.orm import Session

from models.reservation import Reservation
from models.space import Space


class SpaceRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(
        self,
        name: str | None = None,
        location: str | None = None,
        is_active: bool | None = None,
        min_capacity: int | None = None,
    ) -> list[Space]:
        stmt = select(Space)
        if name:
            stmt = stmt.where(Space.name.ilike(f"%{name}%"))
        if location:
            stmt = stmt.where(Space.location.ilike(f"%{location}%"))
        if is_active is not None:
            stmt = stmt.where(Space.is_active == is_active)
        if min_capacity is not None:
            stmt = stmt.where(Space.capacity >= min_capacity)
        return list(self.db.scalars(stmt.order_by(Space.id)))

    def get(self, space_id: int) -> Space | None:
        return self.db.get(Space, space_id)

    def add(self, space: Space) -> Space:
        self.db.add(space)
        self.db.commit()
        self.db.refresh(space)
        return space

    def save(self, space: Space) -> Space:
        self.db.commit()
        self.db.refresh(space)
        return space

    def delete(self, space: Space) -> None:
        self.db.delete(space)
        self.db.commit()

    def has_reservations(self, space_id: int) -> bool:
        stmt = select(Reservation.id).where(Reservation.space_id == space_id).limit(1)
        return self.db.scalar(stmt) is not None
