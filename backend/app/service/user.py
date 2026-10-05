from app.schemas.user import UserCreate, UserUpdate, User

# simulando um bd

users_db: dict[int, User] = {}
next_id = 1

# Listar todos os usuários
def get_all_users() -> list[User]:
    return list(users_db.values())

# Buscar usuário por ID
def get_user_by_id(user_id: int) -> User | None:
    return users_db.get(user_id)

# Criar usuário
def create_user(user: UserCreate) -> User:
    global next_id
    user_dict = user.model_dump()
    user_dict["id"] = next_id
    next_id += 1
    user_obj = User(**user_dict)
    users_db[user_obj.id] = user_obj
    return user_obj

# Atualizar usuário (PUT)
def update_user(user_id: int, user: UserUpdate) -> User | None:
    if user_id not in users_db:
        return None
    user_dict = user.model_dump()
    user_dict["id"] = user_id
    user_obj = User(**user_dict)
    users_db[user_obj.id] = user_obj
    return user_obj

#  Atualizar parcialmente um usuário (PATCH)
def patch_user(user_id: int, user: UserUpdate) -> User | None:
    if user_id not in users_db:
        return None
    current = users_db[user_id]
    user_obj = User(
        id=user_id,
        name=user.name if user.name is not None else current.name,
        email=user.email if user.email is not None else current.email,
        password=user.password if user.password is not None else current.password,
    )
    users_db[user_obj.id] = user_obj
    return user_obj

# Deletar usuário por id
def delete_user(user_id: int) -> bool:
    if user_id not in users_db:
        return False
    del users_db[user_id]
    return True

# limpa o bd simulado
def clear_all_users() -> None:
    users_db.clear()
    global next_id
    next_id = 1