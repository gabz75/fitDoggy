DEBUG = True
# SECRET_KEY = 'temporary_secret_key'  # make sure to change this

SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/webapp.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Uploads
UPLOADS_DEFAULT_DEST = '/webapp/static/img/'
UPLOADS_DEFAULT_URL = 'http://localhost:5000/static/img/'
 
UPLOADED_IMAGES_DEST = '/webapp/static/img/'
UPLOADED_IMAGES_URL = 'http://localhost:5000/static/img/'
