"""initial schema: users and found_items

Revision ID: 0001_initial
Revises:
Create Date: 2026-06-29
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("username", name="uq_users_username"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_username", "users", ["username"])
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "found_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("uploader_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("uploader_username", sa.String(length=50), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=False),
        sa.Column("object_name", sa.String(length=120), nullable=True),
        sa.Column("category", sa.String(length=60), nullable=True),
        sa.Column("color", sa.String(length=60), nullable=True),
        sa.Column("brand", sa.String(length=120), nullable=True),
        sa.Column("features", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("confidence_score", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("location_found", sa.String(length=120), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_found_items_uploader_id", "found_items", ["uploader_id"])
    op.create_index("ix_found_items_category", "found_items", ["category"])
    op.create_index("ix_found_items_location_found", "found_items", ["location_found"])
    op.create_index("ix_found_items_object_name", "found_items", ["object_name"])


def downgrade() -> None:
    op.drop_table("found_items")
    op.drop_table("users")
