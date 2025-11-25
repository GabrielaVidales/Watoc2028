import os, dotenv

BASE_DIR =  os.path.abspath(os.path.dirname(__file__))
dotenv.load_dotenv(os.path.join(BASE_DIR, '.env'))

class BaseConfig(object):
    SECRET_KEY = '7110c8ae51a4b5af97be6534caef90e4bb9bdcb3380af008f90b23a5d1616bf319bc298105da20fe'
    DEBUG = True
    TESTING = True
    UPLOAD_FOLDER = 'uploads'

    # SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "app.db")
    # SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "instance", "app.db")
    # SQLALCHEMY_TRACK_MODIFICATIONS = False

    MONGO_URI = r'mongodb://admin:password@localhost:27017/test?authSource=admin'

    MAIL_SERVER = 'smtp.example.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'tu-email@example.com'
    MAIL_PASSWORD = 'tu-contraseña'
    MAIL_DEFAULT_SENDER = 'tu-email@example.com'