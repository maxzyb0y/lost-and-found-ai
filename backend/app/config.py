"""Application configuration loaded from environment variables.

Uses pydantic-settings so every field can be overridden by an env var of the
same name (case-insensitive). Sensible defaults keep the app runnable locally
even when optional integrations (Gemini, S3/R2) are not configured.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Database ---
    database_url: str = "postgresql+psycopg2://lostfound:lostfound@localhost:5432/lostfound"
    auto_create_tables: bool = True  # set False if you manage schema via Alembic only

    # --- Auth / JWT ---
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24  # 1 day

    # --- CORS ---
    cors_origins: str = "http://localhost:3000"

    # --- Storage ---
    # "auto" -> use S3/R2 when credentials are present, otherwise local disk.
    storage_backend: str = "auto"  # auto | local | s3
    upload_dir: str = "uploads"
    public_base_url: str = "http://localhost:8000"  # used to build local image URLs
    s3_bucket: str | None = None
    s3_endpoint_url: str | None = None  # e.g. https://<account>.r2.cloudflarestorage.com
    s3_access_key_id: str | None = None
    s3_secret_access_key: str | None = None
    s3_region: str = "auto"
    s3_public_base_url: str | None = None  # public URL prefix that serves the bucket

    # --- Gemini ---
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def resolved_storage_backend(self) -> str:
        if self.storage_backend in ("local", "s3"):
            return self.storage_backend
        if self.s3_bucket and self.s3_access_key_id and self.s3_secret_access_key:
            return "s3"
        return "local"

    @property
    def ai_enabled(self) -> bool:
        return bool(self.gemini_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
