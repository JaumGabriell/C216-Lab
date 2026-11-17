from fastapi import FastAPI

app = FastAPI(title="RoomBook API")


@app.get("/health")
def health():
    return {"status": "ok"}