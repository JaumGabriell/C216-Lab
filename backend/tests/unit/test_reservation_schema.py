import pytest
from pydantic import ValidationError

from app.schemas.reservation import ReservationCreate


def base(**over):
    data = {
        "space_id": 1,
        "requester_name": "Ana",
        "requester_email": "ana@email.com",
        "reservation_date": "2026-12-01",
        "start_time": "10:00",
        "end_time": "11:00",
    }
    data.update(over)
    return data


def test_valid_reservation():
    assert ReservationCreate(**base()).space_id == 1


def test_end_before_start_is_invalid():
    with pytest.raises(ValidationError):
        ReservationCreate(**base(start_time="11:00", end_time="10:00"))


def test_invalid_email():
    with pytest.raises(ValidationError):
        ReservationCreate(**base(requester_email="sem-arroba"))
