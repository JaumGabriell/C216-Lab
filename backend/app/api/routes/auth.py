import hashlib
import secrets

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.schemas.user import AuthRead, UserLogin, UserRegister
from core.exceptions import AppError, ConflictError
from database.session import get_db
from models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"{salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt, digest = password_hash.split("$", 1)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
        return secrets.compare_digest(candidate.hex(), digest)
    except ValueError:
        return False


def get_role(email: str) -> str:
    return "admin" if email.lower().endswith("@admin.com") else "user"


@router.post("/register", response_model=AuthRead, status_code=201)
def register(data: UserRegister, db: Session = Depends(get_db)):
    normalized_email = data.email.strip().lower()
    if db.query(User).filter(User.email == normalized_email).first():
        raise ConflictError("Já existe uma conta com este e-mail")

    user = User(
        name=data.name.strip(),
        email=normalized_email,
        password_hash=hash_password(data.password),
        role=get_role(normalized_email),
        token=secrets.token_hex(32),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthRead(token=user.token, user=user)


@router.post("/login", response_model=AuthRead)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.strip().lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise AppError("E-mail ou senha inválidos")
    user.token = secrets.token_hex(32)
    db.commit()
    db.refresh(user)
    return AuthRead(token=user.token, user=user)


@router.post("/logout")
def logout(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
        user = db.query(User).filter(User.token == token).first()
        if user:
            user.token = None
            db.commit()
    return {"status": "ok"}
