DEBUG = True
# SECRET_KEY = 'temporary_secret_key'  # make sure to change this

SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/webapp.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Uploads
UPLOAD_FOLDER = 'webapp/static/img/tmp/'
UPLOAD_URL = 'static/img/tmp/'