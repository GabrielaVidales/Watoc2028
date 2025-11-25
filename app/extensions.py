from flask_login import LoginManager
from flask_mail import Mail
import mongoengine
from pymongo import MongoClient

login_manager = LoginManager()
mail = Mail()

def init_mongo_app(app):
    mongoengine.connect(
        host=app.config['MONGO_URI'],
        alias='default'
    )

def get_mongo_client() -> MongoClient:
    return mongoengine.get_connection(alias='default')

def get_mongo_db():
    return mongoengine.get_db(alias='default')