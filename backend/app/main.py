from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.routes import reservations, spaces
from core.exceptions import AppError

app = FastAPI(title="RoomBook API", version="0.1.0")


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}


app.include_router(spaces.router)
app.include_router(reservations.router)
