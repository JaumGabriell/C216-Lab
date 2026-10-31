from sqlalchemy.orm import Session

from app.schemas.user import User as UserSchema
from app.schemas.user import UserCreate, UserUpdate
from repositories.user import UserRepository


def get_all_users(db: Session) -> list[UserSchema]:
    repo = UserRepository(db)
    users = repo.get_all()
    return [UserSchema.model_validate(u, from_attributes=True) for u in users]


def get_user_by_id(db: Session, user_id: int) -> UserSchema | None:
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if user:
        return UserSchema.model_validate(user, from_attributes=True)
    return None


def create_user(db: Session, user: UserCreate) -> UserSchema:
    repo = UserRepository(db)
    db_user = repo.create(
        name=user.name,
        email=user.email,
        password=user.password,
    )
    return UserSchema.model_validate(db_user, from_attributes=True)


def update_user(db: Session, user_id: int, user: UserCreate) -> UserSchema | None:
    repo = UserRepository(db)
    db_user = repo.get_by_id(user_id)
    if not db_user:
        return None
    updated = repo.update(
        db_user,
        name=user.name,
        email=user.email,
        password=user.password,
    )
    return UserSchema.model_validate(updated, from_attributes=True)


def patch_user(db: Session, user_id: int, user: UserUpdate) -> UserSchema | None:
    repo = UserRepository(db)
    db_user = repo.get_by_id(user_id)
    if not db_user:
        return None
    update_data = user.model_dump(exclude_unset=True)
    updated = repo.update(db_user, **update_data)
    return UserSchema.model_validate(updated, from_attributes=True)


def delete_user(db: Session, user_id: int) -> bool:
    repo = UserRepository(db)
    db_user = repo.get_by_id(user_id)
    if not db_user:
        return False
    repo.delete(db_user)
    return True
