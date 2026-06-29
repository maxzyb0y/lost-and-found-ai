from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class FoundItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uploader_id: int
    uploader_username: str
    image_url: str
    object_name: str | None = None
    category: str | None = None
    color: str | None = None
    brand: str | None = None
    features: list[str] = []
    confidence_score: float | None = None
    location_found: str
    notes: str | None = None
    created_at: datetime

    @field_validator("features", mode="before")
    @classmethod
    def _features_default(cls, v: object) -> list[str]:
        return list(v) if v else []


class FoundItemList(BaseModel):
    items: list[FoundItemOut]
    total: int
