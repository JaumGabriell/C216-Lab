class AppError(Exception):
    status_code = 400

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class NotFoundError(AppError):
    status_code = 404


class BusinessRuleError(AppError):
    """Violação de regra de negócio (ex.: espaço desativado, horário inválido)."""

    status_code = 422


class ConflictError(AppError):
    """Conflito de estado (ex.: horário já reservado, espaço com reservas)."""

    status_code = 409
