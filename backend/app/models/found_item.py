from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ..database import Base


class FoundItem(Base):
    __tablename__ = "found_items"

    id = Column(Integer, primary_key=True, index=True)
    uploader_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    uploader_username = Column(String(50), nullable=False)  # denormalized for fast card rendering
    image_url = Column(Text, nullable=False)

    # AI-generated metadata (Gemini Vision)
    object_name = Column(String(120))
    category = Column(String(60), index=True)
    color = Column(String(60))
    brand = Column(String(120))
    features = Column(JSONB, nullable=False, default=list)
    confidence_score = Column(Numeric(5, 2))  # 0-100

    # User-supplied metadata
    location_found = Column(String(120), nullable=False, index=True)
    notes = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    uploader = relationship("User", back_populates="items")
