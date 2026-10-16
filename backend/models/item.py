from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(Text, default=None)
