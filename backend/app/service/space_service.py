from app.schemas.space import SpaceCreate, SpaceUpdate
from core.exceptions import ConflictError, NotFoundError
from models.space import Space
from repositories.space_repository import SpaceRepository


class SpaceService:
    def __init__(self, repo: SpaceRepository):
        self.repo = repo

    def list(self, **filters) -> list[Space]:
        return self.repo.list(**filters)

    def get(self, space_id: int) -> Space:
        space = self.repo.get(space_id)
        if not space:
            raise NotFoundError("Espaço não encontrado")
        return space

    def create(self, data: SpaceCreate) -> Space:
        return self.repo.add(Space(**data.model_dump()))

    def update(self, space_id: int, data: SpaceUpdate) -> Space:
        space = self.get(space_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(space, field, value)
        return self.repo.save(space)

    def delete(self, space_id: int) -> None:
        space = self.get(space_id)
        # Regra 6: não excluir espaço com reservas vinculadas
        if self.repo.has_reservations(space_id):
            raise ConflictError(
                "Espaço possui reservas vinculadas; desative-o (is_active=false) em vez de excluir"
            )
        self.repo.delete(space)
