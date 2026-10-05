from fastapi import APIRouter, HTTPException

from app.service import user as user_service
from app.schemas.user import User, UserCreate, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[User])
def get_users():
    return user_service.get_all_users()


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int):
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=User, status_code=201)
def create_user(user: UserCreate):
    return user_service.create_user(user)


@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user: UserCreate):
    result = user_service.update_user(user_id, user)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.patch("/{user_id}", response_model=User)
def patch_user(user_id: int, user: UserUpdate):
    result = user_service.patch_user(user_id, user)  # patch_user, não update_user
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int):
    if not user_service.delete_user(user_id):
        raise HTTPException(status_code=404, detail="User not found")