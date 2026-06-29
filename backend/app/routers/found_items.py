from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.found_item import FoundItem
from ..models.user import User
from ..schemas.found_item import FoundItemList, FoundItemOut
from ..services.deps import get_current_admin, get_current_user
from ..services.gemini import analyze_image
from ..services.storage import save_image

router = APIRouter(prefix="/found-items", tags=["found-items"])

_MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("", response_model=FoundItemOut, status_code=status.HTTP_201_CREATED)
async def create_found_item(
    image: UploadFile = File(...),
    location_found: str = Form(...),
    notes: str | None = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FoundItem:
    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="Image file is empty")
    if len(data) > _MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large (max 10 MB)")

    mime = image.content_type or "image/jpeg"
    image_url = save_image(data, image.filename, mime)
    ai = analyze_image(data, mime)

    item = FoundItem(
        uploader_id=current_user.id,
        uploader_username=current_user.username,
        image_url=image_url,
        object_name=ai.get("object_name"),
        category=ai.get("category"),
        color=ai.get("color"),
        brand=ai.get("brand"),
        features=ai.get("features", []),
        confidence_score=ai.get("confidence_score"),
        location_found=location_found.strip(),
        notes=(notes.strip() if notes and notes.strip() else None),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("", response_model=FoundItemList)
def list_found_items(
    category: str | None = Query(None),
    q: str | None = Query(None, description="Free-text filter across item fields"),
    uploader: str | None = Query(None, description="Filter by uploader username"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> FoundItemList:
    query = db.query(FoundItem)

    if category:
        query = query.filter(FoundItem.category.ilike(category))
    if uploader:
        query = query.filter(FoundItem.uploader_username.ilike(uploader))
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                FoundItem.object_name.ilike(like),
                FoundItem.color.ilike(like),
                FoundItem.category.ilike(like),
                FoundItem.brand.ilike(like),
                FoundItem.location_found.ilike(like),
                FoundItem.notes.ilike(like),
            )
        )

    total = query.count()
    items = (
        query.order_by(FoundItem.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return FoundItemList(items=items, total=total)


@router.get("/{item_id}", response_model=FoundItemOut)
def get_found_item(item_id: int, db: Session = Depends(get_db)) -> FoundItem:
    item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_found_item(
    item_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> None:
    item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
