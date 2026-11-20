from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.service.reservation_service import ReservationService
from app.service.space_service import SpaceService
from core.exceptions import AppError
from database.session import get_db
from models.user import User
from repositories.reservation_repository import ReservationRepository
from repositories.space_repository import SpaceRepository


def get_space_service(db: Session = Depends(get_db)) -> SpaceService:
    return SpaceService(SpaceRepository(db))


def get_reservation_service(db: Session = Depends(get_db)) -> ReservationService:
    return ReservationService(ReservationRepository(db), SpaceRepository(db))


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise AppError("Autenticação necessária")
    token = authorization.removeprefix("Bearer ")
    user = db.query(User).filter(User.token == token).first()
    if not user:
        raise AppError("Sessão inválida")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise AppError("Acesso permitido apenas para administradores")
    return user
