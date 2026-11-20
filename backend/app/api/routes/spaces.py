from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_space_service, require_admin
from app.schemas.space import SpaceCreate, SpaceRead, SpaceUpdate
from app.service.space_service import SpaceService

router = APIRouter(prefix="/spaces", tags=["Spaces"])


@router.get("", response_model=list[SpaceRead])
def list_spaces(
    name: str | None = None,
    location: str | None = None,
    is_active: bool | None = None,
    min_capacity: int | None = Query(default=None, gt=0),
    service: SpaceService = Depends(get_space_service),
):
    return service.list(
        name=name, location=location, is_active=is_active, min_capacity=min_capacity
    )


@router.get("/{space_id}", response_model=SpaceRead)
def get_space(space_id: int, service: SpaceService = Depends(get_space_service)):
    return service.get(space_id)


@router.post("", response_model=SpaceRead, status_code=status.HTTP_201_CREATED)
def create_space(
    data: SpaceCreate,
    service: SpaceService = Depends(get_space_service),
    _admin=Depends(require_admin),
):
    return service.create(data)


@router.put("/{space_id}", response_model=SpaceRead)
def update_space(
    space_id: int,
    data: SpaceUpdate,
    service: SpaceService = Depends(get_space_service),
    _admin=Depends(require_admin),
):
    return service.update(space_id, data)


@router.delete("/{space_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_space(
    space_id: int,
    service: SpaceService = Depends(get_space_service),
    _admin=Depends(require_admin),
):
    service.delete(space_id)
