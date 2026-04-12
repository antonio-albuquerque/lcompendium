"""CLI commands for L·Compendium.

Usage:
    uv run python -m app.cli createsuperuser --username admin --email admin@example.com --password secret123
"""

from __future__ import annotations

import argparse
import asyncio
import sys

from sqlalchemy import select

from app.database import async_session
from app.models.user import User
from app.services.auth import hash_password


async def create_superuser(username: str, email: str, password: str) -> None:
    async with async_session() as session:
        result = await session.execute(
            select(User).where(
                (User.username == username) | (User.email == email)
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            print(f"Error: user with username '{username}' or email '{email}' already exists.")
            sys.exit(1)

        user = User(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            is_active=True,
            is_approved=True,
            is_superuser=True,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        print(f"Superuser '{username}' created (id: {user.id})")


def main() -> None:
    parser = argparse.ArgumentParser(description="L·Compendium CLI")
    sub = parser.add_subparsers(dest="command")

    su = sub.add_parser("createsuperuser", help="Create the first superuser")
    su.add_argument("--username", required=True)
    su.add_argument("--email", required=True)
    su.add_argument("--password", required=True)

    args = parser.parse_args()
    if args.command == "createsuperuser":
        asyncio.run(create_superuser(args.username, args.email, args.password))
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
