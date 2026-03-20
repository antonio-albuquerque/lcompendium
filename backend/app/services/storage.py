from __future__ import annotations

import uuid

import aioboto3

from app.config import get_settings


def _session() -> aioboto3.Session:
    return aioboto3.Session()


async def upload_file(file_bytes: bytes, filename: str, content_type: str) -> str:
    """Upload a file to S3 and return the object key."""
    settings = get_settings()
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "bin"
    key = f"{uuid.uuid4().hex}.{ext}"

    async with _session().client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
    ) as s3:
        await s3.put_object(
            Bucket=settings.S3_BUCKET,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )

    return key


async def get_presigned_url(key: str, expires_in: int = 3600) -> str:
    """Generate a presigned GET URL for an S3 object."""
    settings = get_settings()

    async with _session().client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
    ) as s3:
        url: str = await s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.S3_BUCKET, "Key": key},
            ExpiresIn=expires_in,
        )

    return url


async def delete_file(key: str) -> None:
    """Delete an object from S3."""
    settings = get_settings()

    async with _session().client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
    ) as s3:
        await s3.delete_object(Bucket=settings.S3_BUCKET, Key=key)
