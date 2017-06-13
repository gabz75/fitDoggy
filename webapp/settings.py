import os

SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.environ['SECRET_KEY']
# Uploads
UPLOAD_FOLDER = 'webapp/static/img/tmp/'
UPLOAD_URL = 'static/img/tmp/'