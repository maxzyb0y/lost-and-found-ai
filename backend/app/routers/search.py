from fastapi import APIRouter, Depends
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.found_item import FoundItem
from ..schemas.search import ExtractedFilters, SearchIn, SearchOut
from ..services.gemini import extract_search_filters

router = APIRouter(tags=["search"])

_RESULT_LIMIT = 50


@router.post("/search", response_model=SearchOut)
def search(payload: SearchIn, db: Session = Depends(get_db)) -> SearchOut:
    extracted = extract_search_filters(payload.query)

    filters = []
    if extracted.get("object"):
        filters.append(FoundItem.object_name.ilike(f"%{extracted['object']}%"))
    if extracted.get("color"):
        filters.append(FoundItem.color.ilike(f"%{extracted['color']}%"))
    if extracted.get("location"):
        filters.append(FoundItem.location_found.ilike(f"%{extracted['location']}%"))

    category = payload.category or extracted.get("category")
    if category:
        filters.append(FoundItem.category.ilike(category))

    base = db.query(FoundItem)

    if filters:
        # Prefer precise matches (all filters AND-ed); broaden to OR if none found.
        results = (
            base.filter(and_(*filters))
            .order_by(FoundItem.created_at.desc())
            .limit(_RESULT_LIMIT)
            .all()
        )
        if not results:
            results = (
                base.filter(or_(*filters))
                .order_by(FoundItem.created_at.desc())
                .limit(_RESULT_LIMIT)
                .all()
            )
    else:
        like = f"%{payload.query.strip()}%"
        results = (
            base.filter(
                or_(
                    FoundItem.object_name.ilike(like),
                    FoundItem.color.ilike(like),
                    FoundItem.category.ilike(like),
                    FoundItem.location_found.ilike(like),
                    FoundItem.notes.ilike(like),
                )
            )
            .order_by(FoundItem.created_at.desc())
            .limit(_RESULT_LIMIT)
            .all()
        )

    return SearchOut(
        extracted=ExtractedFilters(**extracted),
        results=results,
        total=len(results),
    )
