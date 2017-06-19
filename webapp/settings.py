import os

SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/models.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.environ['SECRET_KEY']