from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ..database import Base


class LostPost(Base):
    """A post created by someone who lost an item. Manual entry — no AI."""

    __tablename__ = "lost_posts"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    owner_username = Column(String(50), nullable=False)  # denormalized for fast card rendering

    # User-supplied metadata (required)
    item_name = Column(String(120), nullable=False)
    category = Column(String(60), nullable=False, index=True)
    color = Column(String(60), nullable=False)
    location_lost = Column(String(120), nullable=False, index=True)
    date_lost = Column(Date, nullable=False)
    description = Column(Text, nullable=False)

    # User-supplied metadata (optional)
    image_url = Column(Text)
    brand = Column(String(120))
    features = Column(JSONB, nullable=False, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    owner = relationship("User", back_populates="lost_posts")
