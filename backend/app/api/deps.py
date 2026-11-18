from fastapi import Depends
from sqlalchemy.orm import Session

from app.service.reservation_service import ReservationService
from app.service.space_service import SpaceService
from database.session import get_db
from repositories.reservation_repository import ReservationRepository
from repositories.space_repository import SpaceRepository


def get_space_service(db: Session = Depends(get_db)) -> SpaceService:
    return SpaceService(SpaceRepository(db))


def get_reservation_service(db: Session = Depends(get_db)) -> ReservationService:
    return ReservationService(ReservationRepository(db), SpaceRepository(db))
