import os

os.environ['DATABASE_URL'] = 'postgres://nuehhgwkydoikl:69e6342c9ea492093e50b4877e892dabbed87123ffe93a5d83a508a790879697@ec2-107-21-99-176.compute-1.amazonaws.com:5432/dchv40ikr6nqo4'
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
# Uploads
UPLOAD_FOLDER = 'webapp/static/img/tmp/'
UPLOAD_URL = 'static/img/tmp/'