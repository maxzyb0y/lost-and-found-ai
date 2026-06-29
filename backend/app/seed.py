"""Seed the database with demo found items so the dashboard isn't empty.

Run from the backend directory:  python -m app.seed
Creates a demo user (login: max / password123) and a handful of items.
Safe to run repeatedly — it skips seeding when items already exist.
"""
from .database import Base, SessionLocal, engine
from .models.found_item import FoundItem
from .models.user import User
from .services.security import hash_password

DEMO_USER = {"username": "max", "email": "max@example.com", "password": "password123"}

DEMO_ITEMS = [
    {
        "image_url": "https://picsum.photos/seed/bottle/600/400",
        "object_name": "Water Bottle", "category": "Bottles", "color": "Silver",
        "brand": "Hydro Flask", "features": ["Blue sticker", "Small dent"],
        "confidence_score": 94, "location_found": "Library", "notes": "Left on a study desk.",
    },
    {
        "image_url": "https://picsum.photos/seed/backpack/600/400",
        "object_name": "Backpack", "category": "Bags", "color": "Black",
        "brand": None, "features": ["Red zipper pull"],
        "confidence_score": 88, "location_found": "Cafeteria", "notes": None,
    },
    {
        "image_url": "https://picsum.photos/seed/phone/600/400",
        "object_name": "Smartphone", "category": "Electronics", "color": "Black",
        "brand": "Apple", "features": ["Clear case", "Cracked screen protector"],
        "confidence_score": 91, "location_found": "Gym", "notes": "Found near the lockers.",
    },
    {
        "image_url": "https://picsum.photos/seed/keys/600/400",
        "object_name": "Keys", "category": "Keys", "color": "Silver",
        "brand": None, "features": ["Three keys on a red lanyard"],
        "confidence_score": 80, "location_found": "Parking Lot", "notes": None,
    },
    {
        "image_url": "https://picsum.photos/seed/notebook/600/400",
        "object_name": "Notebook", "category": "Stationery", "color": "Blue",
        "brand": None, "features": ["Spiral bound", "Name 'Sara' on cover"],
        "confidence_score": 76, "location_found": "Lecture Hall B", "notes": None,
    },
    {
        "image_url": "https://picsum.photos/seed/jacket/600/400",
        "object_name": "Jacket", "category": "Clothing", "color": "Navy",
        "brand": "North Face", "features": ["Size M", "White logo on chest"],
        "confidence_score": 85, "location_found": "Bus Stop", "notes": None,
    },
]


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(FoundItem).count() > 0:
            print("Found items already exist — skipping seed.")
            return

        user = db.query(User).filter(User.username == DEMO_USER["username"]).first()
        if user is None:
            user = User(
                username=DEMO_USER["username"],
                email=DEMO_USER["email"],
                password_hash=hash_password(DEMO_USER["password"]),
                is_admin=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        for item in DEMO_ITEMS:
            db.add(FoundItem(uploader_id=user.id, uploader_username=user.username, **item))
        db.commit()
        print(
            f"Seeded {len(DEMO_ITEMS)} found items. "
            f"Demo login -> username: {DEMO_USER['username']}  password: {DEMO_USER['password']}"
        )
    finally:
        db.close()


if __name__ == "__main__":
    run()
