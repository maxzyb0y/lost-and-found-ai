"""FastAPI application entrypoint."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Register models, then (optionally) bootstrap the schema for a zero-config start.
    from . import models  # noqa: F401

    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Lost & Found AI", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve locally-stored uploads when no S3/R2 bucket is configured.
if settings.resolved_storage_backend == "local":
    os.makedirs(settings.upload_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

from .routers import auth, found_items, search  # noqa: E402  (after app config)

app.include_router(auth.router)
app.include_router(found_items.router)
app.include_router(search.router)


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok", "ai_enabled": settings.ai_enabled, "storage": settings.resolved_storage_backend}
