"""create lost_posts table

Revision ID: 0003_create_lost_posts
Revises: 0002_add_is_admin
Create Date: 2026-07-01
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003_create_lost_posts"
down_revision: Union[str, None] = "0002_add_is_admin"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "lost_posts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("owner_username", sa.String(length=50), nullable=False),
        sa.Column("item_name", sa.String(length=120), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("color", sa.String(length=60), nullable=False),
        sa.Column("location_lost", sa.String(length=120), nullable=False),
        sa.Column("date_lost", sa.Date(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("brand", sa.String(length=120), nullable=True),
        sa.Column("features", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_lost_posts_owner_id", "lost_posts", ["owner_id"])
    op.create_index("ix_lost_posts_category", "lost_posts", ["category"])
    op.create_index("ix_lost_posts_location_lost", "lost_posts", ["location_lost"])


def downgrade() -> None:
    op.drop_table("lost_posts")
