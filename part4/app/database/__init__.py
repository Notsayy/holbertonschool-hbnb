from flask import current_app
from app.extensions import db
from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place

def init_db():
    """Initialize the database by creating tables."""
    db.create_all()
    
def seed_db():
    """Seeds the database with initial data if it doesn't exist."""
    _seed_admin_user()
    _seed_amenities()
    _seed_places()
    
    db.session.commit()

def _seed_admin_user():
    """Create the admin user if it doesn't exist."""
    admin_exists = User.query.filter_by(email=current_app.config['ADMIN_EMAIL']).first()
    
    if not admin_exists:
        admin = User(
            first_name=current_app.config['ADMIN_FIRST_NAME'],
            last_name=current_app.config['ADMIN_LAST_NAME'],
            email=current_app.config['ADMIN_EMAIL'],
            password=current_app.config['ADMIN_PASSWORD'],
            is_admin=True
        )
        db.session.add(admin)
        current_app.logger.info(f"Admin user created: {admin.email}")
    else:
        current_app.logger.info("Admin user already exists.")

def _seed_amenities():
    """Create the initial amenities if they don't exist."""
    for amenity_name in current_app.config['INITIAL_AMENITIES']:
        if not Amenity.query.filter_by(name=amenity_name).first():
            amenity = Amenity(
                name=amenity_name
            )
            db.session.add(amenity)
            current_app.logger.info(f"Amenity created: {amenity.name}")
        else:
            current_app.logger.info(f"Amenity already exists: {amenity_name}")

def _seed_places():
    """Create sample places if they don't exist."""
    places_exist = Place.query.first()
    if places_exist:
        current_app.logger.info("Places already exist.")
        return
    
    admin = User.query.filter_by(email=current_app.config['ADMIN_EMAIL']).first()
    if not admin:
        current_app.logger.error("Admin user not found. Cannot create places.")
        return
    
    sample_places = [
    {
        "title": "Modern Loft in London",
        "description": "Stylish loft with city views.",
        "price": 150,
        "latitude": 51.5236,
        "longitude": -0.0755,
        "owner": admin
    },
    {
        "title": "Beachfront Bungalow in Bali",
        "description": "Cozy bungalow by the ocean.",
        "price": 105,
        "latitude": -8.4095,
        "longitude": 115.1889,
        "owner": admin
    },
    {
        "title": "Luxury Penthouse in Dubai",
        "description": "Luxury penthouse with Burj Khalifa views.",
        "price": 99,
        "latitude": 25.2048,
        "longitude": 55.2708,
        "owner": admin
    }
]

    
    for place_data in sample_places:
        place = Place(**place_data)
        db.session.add(place)
        current_app.logger.info(f"Place created: {place.title}")