"""Image storage abstraction.

Uploads to an S3-compatible bucket (AWS S3 or Cloudflare R2) when credentials
are configured, otherwise falls back to the local disk so the app runs with
zero cloud setup. Both backends return a publicly reachable URL.
"""
import mimetypes
import os
import uuid

from ..config import settings


def _extension(filename: str | None, content_type: str | None) -> str:
    if filename and "." in filename:
        return filename.rsplit(".", 1)[1].lower()
    if content_type:
        guessed = mimetypes.guess_extension(content_type)
        if guessed:
            return guessed.lstrip(".")
    return "jpg"


def save_image(data: bytes, filename: str | None, content_type: str | None) -> str:
    """Persist image bytes and return a public URL."""
    key = f"{uuid.uuid4().hex}.{_extension(filename, content_type)}"
    if settings.resolved_storage_backend == "s3":
        return _save_s3(data, key, content_type)
    return _save_local(data, key)


def _save_local(data: bytes, key: str) -> str:
    os.makedirs(settings.upload_dir, exist_ok=True)
    with open(os.path.join(settings.upload_dir, key), "wb") as fh:
        fh.write(data)
    return f"{settings.public_base_url.rstrip('/')}/uploads/{key}"


def _save_s3(data: bytes, key: str, content_type: str | None) -> str:
    import boto3  # imported lazily so local-only deployments don't need it

    client = boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.s3_access_key_id,
        aws_secret_access_key=settings.s3_secret_access_key,
        region_name=settings.s3_region,
    )
    client.put_object(
        Bucket=settings.s3_bucket,
        Key=key,
        Body=data,
        ContentType=content_type or "application/octet-stream",
    )
    if settings.s3_public_base_url:
        return f"{settings.s3_public_base_url.rstrip('/')}/{key}"
    return f"{(settings.s3_endpoint_url or '').rstrip('/')}/{settings.s3_bucket}/{key}"
