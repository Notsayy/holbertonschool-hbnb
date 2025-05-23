from flask import Flask, send_from_directory
from flask_restx import Api
from flask_cors import CORS
from app.api.v1.users import api as users_ns
from app.api.v1.amenities import api as amenities_ns
from app.api.v1.places import api as places_ns
from app.api.v1.reviews import api as reviews_ns
from app.api.v1.auth import api as auth_ns
from app.extensions import bcrypt, jwt, db
from app.database import init_db, seed_db
import os

def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, resources={r"/api/v1/*": {"origins": app.config['CORS_ORIGINS'], "supports_credentials": True}})
    api = Api(app, version='1.0', title='HBnB API', description='HBnB Application API')
    bcrypt.init_app(app=app)
    jwt.init_app(app=app)
    db.init_app(app)
    with app.app_context():
        init_db()
        seed_db()
    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    api.add_namespace(places_ns, path='/api/v1/places')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    api.add_namespace(auth_ns, path='/api/v1/auth')
    
    # Servir les fichiers statiques
    @app.route('/')
    def index():
        return send_from_directory('../base_files', 'index.html')
    
    @app.route('/<path:filename>')
    def serve_static(filename):
        if filename.startswith('base_files/'):
            return send_from_directory('..', filename)
        elif filename.startswith('images/'):
            return send_from_directory('..', filename)
        else:
            return send_from_directory('../base_files', filename)
    
    return app
