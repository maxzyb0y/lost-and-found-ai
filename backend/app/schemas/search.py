from pydantic import BaseModel

from .found_item import FoundItemOut


class SearchIn(BaseModel):
    query: str
    category: str | None = None


class ExtractedFilters(BaseModel):
    object: str | None = None
    color: str | None = None
    location: str | None = None
    category: str | None = None


class SearchOut(BaseModel):
    extracted: ExtractedFilters
    results: list[FoundItemOut]
    total: int
