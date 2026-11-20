from datetime import date

from fastapi import APIRouter, Depends

from app.api.deps import get_reservation_service
from app.schemas.reservation import (
    ReservationCreate,
    ReservationRead,
    ReservationUpdate,
)
from app.service.reservation_service import ReservationService
from models.reservation import ReservationStatus
from app.api.deps import get_reservation_service, require_admin

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.get("", response_model=list[ReservationRead])
def list_reservations(
    space_id: int | None = None,
    reservation_date: date | None = None,
    status: ReservationStatus | None = None,
    requester_email: str | None = None,
    service: ReservationService = Depends(get_reservation_service),
):
    return service.list(
        space_id=space_id,
        reservation_date=reservation_date,
        status=status.value if status else None,
        requester_email=requester_email,
    )


@router.get("/{reservation_id}", response_model=ReservationRead)
def get_reservation(
    reservation_id: int, service: ReservationService = Depends(get_reservation_service)
):
    return service.get(reservation_id)


@router.post("", response_model=ReservationRead, status_code=201)
def create_reservation(
    data: ReservationCreate,
    service: ReservationService = Depends(get_reservation_service),
):
    return service.create(data)


@router.put("/{reservation_id}", response_model=ReservationRead)
def update_reservation(
    reservation_id: int,
    data: ReservationUpdate,
    service: ReservationService = Depends(get_reservation_service),
):
    return service.update(reservation_id, data)


@router.patch("/{reservation_id}/cancel", response_model=ReservationRead)
def cancel_reservation(
    reservation_id: int, service: ReservationService = Depends(get_reservation_service)
):
    return service.cancel(reservation_id)
