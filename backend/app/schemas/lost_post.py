from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, field_validator


class LostPostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    owner_username: str
    item_name: str
    category: str
    color: str
    location_lost: str
    date_lost: date
    description: str
    image_url: str | None = None
    brand: str | None = None
    features: list[str] = []
    created_at: datetime

    @field_validator("features", mode="before")
    @classmethod
    def _features_default(cls, v: object) -> list[str]:
        return list(v) if v else []


class LostPostList(BaseModel):
    items: list[LostPostOut]
    total: int
