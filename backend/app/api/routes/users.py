from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import User, UserCreate, UserUpdate
from app.service import user as user_service
from database import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[User])
def get_users(db: Session = Depends(get_db)):
    return user_service.get_all_users(db)


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=User, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user)


@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    result = user_service.update_user(db, user_id, user)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.patch("/{user_id}", response_model=User)
def patch_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    result = user_service.patch_user(db, user_id, user)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    if not user_service.delete_user(db, user_id):
        raise HTTPException(status_code=404, detail="User not found")
