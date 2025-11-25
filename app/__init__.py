import os
from flask import Flask
from .routes import bp
from config import BaseConfig
from .extensions import login_manager, mail ,init_mongo_app

def create_app():
    app = Flask(__name__, template_folder='/templates')
    app.config.from_object(BaseConfig)
    
    init_mongo_app(app)
    mail.init_app(app)
    login_manager.init_app(app)
    # login_manager.login_view = 'Por determinar...'

    app.register_blueprint(bp)
    return app
