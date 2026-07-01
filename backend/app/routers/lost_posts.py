from datetime import date

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
from ..models.lost_post import LostPost
from ..models.user import User
from ..schemas.lost_post import LostPostList, LostPostOut
from ..services.deps import get_current_admin, get_current_user
from ..services.storage import save_image

router = APIRouter(prefix="/lost-posts", tags=["lost-posts"])

_MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB


def _split_features(raw: str | None) -> list[str]:
    """Turn a comma-separated string into a clean list of features."""
    if not raw:
        return []
    return [f.strip() for f in raw.split(",") if f.strip()]


@router.post("", response_model=LostPostOut, status_code=status.HTTP_201_CREATED)
async def create_lost_post(
    item_name: str = Form(...),
    category: str = Form(...),
    color: str = Form(...),
    location_lost: str = Form(...),
    date_lost: date = Form(...),
    description: str = Form(...),
    brand: str | None = Form(None),
    features: str | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LostPost:
    image_url: str | None = None
    if image is not None:
        data = await image.read()
        if data:
            if len(data) > _MAX_IMAGE_BYTES:
                raise HTTPException(status_code=413, detail="Image is too large (max 10 MB)")
            mime = image.content_type or "image/jpeg"
            image_url = save_image(data, image.filename, mime)

    post = LostPost(
        owner_id=current_user.id,
        owner_username=current_user.username,
        item_name=item_name.strip(),
        category=category.strip(),
        color=color.strip(),
        location_lost=location_lost.strip(),
        date_lost=date_lost,
        description=description.strip(),
        image_url=image_url,
        brand=(brand.strip() if brand and brand.strip() else None),
        features=_split_features(features),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("", response_model=LostPostList)
def list_lost_posts(
    category: str | None = Query(None),
    q: str | None = Query(None, description="Free-text filter across post fields"),
    owner: str | None = Query(None, description="Filter by owner username"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> LostPostList:
    query = db.query(LostPost)

    if category:
        query = query.filter(LostPost.category.ilike(category))
    if owner:
        query = query.filter(LostPost.owner_username.ilike(owner))
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                LostPost.item_name.ilike(like),
                LostPost.color.ilike(like),
                LostPost.category.ilike(like),
                LostPost.brand.ilike(like),
                LostPost.location_lost.ilike(like),
                LostPost.description.ilike(like),
            )
        )

    total = query.count()
    posts = (
        query.order_by(LostPost.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return LostPostList(items=posts, total=total)


@router.get("/{post_id}", response_model=LostPostOut)
def get_lost_post(post_id: int, db: Session = Depends(get_db)) -> LostPost:
    post = db.query(LostPost).filter(LostPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Lost post not found")
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lost_post(
    post_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> None:
    post = db.query(LostPost).filter(LostPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Lost post not found")
    db.delete(post)
    db.commit()
