from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SpaceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    capacity: int = Field(gt=0)
    location: str = Field(min_length=1, max_length=150)
    is_active: bool = True


class SpaceUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    capacity: int | None = Field(default=None, gt=0)
    location: str | None = Field(default=None, min_length=1, max_length=150)
    is_active: bool | None = None


class SpaceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    capacity: int
    location: str
    is_active: bool
    created_at: datetime
