from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.item import Item


class ItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, description: str | None) -> Item:
        item = Item(title=name, description=description)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_by_id(self, item_id: int) -> Item | None:
        return self.db.get(Item, item_id)

    def get_by_name(self, name: str) -> Item | None:
        result = self.db.scalar(select(Item).where(Item.title == name))
        return result

    def get_all(self) -> list[Item]:
        statement = select(Item)
        result = self.db.scalars(statement).all()
        return result

    def update(self, item: Item) -> Item:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: Item) -> None:
        self.db.delete(item)
        self.db.commit()
