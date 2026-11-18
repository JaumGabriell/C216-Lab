from datetime import date, time

from app.schemas.reservation import ReservationCreate, ReservationUpdate
from core.exceptions import BusinessRuleError, ConflictError, NotFoundError
from models.reservation import Reservation, ReservationStatus
from repositories.reservation_repository import ReservationRepository
from repositories.space_repository import SpaceRepository


class ReservationService:
    def __init__(self, repo: ReservationRepository, space_repo: SpaceRepository):
        self.repo = repo
        self.space_repo = space_repo

    def list(self, **filters) -> list[Reservation]:
        return self.repo.list(**filters)

    def get(self, reservation_id: int) -> Reservation:
        reservation = self.repo.get(reservation_id)
        if not reservation:
            raise NotFoundError("Reserva não encontrada")  # regra 5
        return reservation

    # ---------- validações reutilizáveis ----------
    @staticmethod
    def _validate_times(start: time, end: time) -> None:
        if end <= start:  # regra 2
            raise BusinessRuleError(
                "O horário de término deve ser posterior ao inicial"
            )

    def _ensure_available(
        self,
        space_id: int,
        reservation_date: date,
        start: time,
        end: time,
        exclude_id: int | None = None,
    ) -> None:
        conflicts = self.repo.find_conflicts(
            space_id, reservation_date, start, end, exclude_id
        )
        if conflicts:  # regra 1
            raise ConflictError("Já existe uma reserva neste espaço nesse horário")

    # ---------- casos de uso ----------
    def create(self, data: ReservationCreate) -> Reservation:
        space = self.space_repo.get(data.space_id)
        if not space:
            raise NotFoundError("Espaço não encontrado")
        if not space.is_active:  # regra 3
            raise BusinessRuleError("Não é possível reservar um espaço desativado")

        self._validate_times(data.start_time, data.end_time)
        self._ensure_available(
            data.space_id, data.reservation_date, data.start_time, data.end_time
        )

        reservation = Reservation(
            **data.model_dump(), status=ReservationStatus.CONFIRMED.value
        )
        return self.repo.add(reservation)

    def update(self, reservation_id: int, data: ReservationUpdate) -> Reservation:
        reservation = self.get(reservation_id)
        if reservation.status == ReservationStatus.CANCELLED.value:
            raise BusinessRuleError("Não é possível editar uma reserva cancelada")

        changes = data.model_dump(exclude_unset=True)
        new_date = changes.get("reservation_date", reservation.reservation_date)
        new_start = changes.get("start_time", reservation.start_time)
        new_end = changes.get("end_time", reservation.end_time)

        self._validate_times(new_start, new_end)
        # regra 7: rechecar disponibilidade ignorando a própria reserva
        self._ensure_available(
            reservation.space_id,
            new_date,
            new_start,
            new_end,
            exclude_id=reservation.id,
        )

        for field, value in changes.items():
            setattr(reservation, field, value)
        return self.repo.save(reservation)

    def cancel(self, reservation_id: int) -> Reservation:
        reservation = self.get(reservation_id)
        if reservation.status == ReservationStatus.CANCELLED.value:
            raise BusinessRuleError("Reserva já está cancelada")
        reservation.status = ReservationStatus.CANCELLED.value
        return self.repo.save(reservation)
