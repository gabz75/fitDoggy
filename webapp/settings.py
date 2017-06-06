import os

os.environ['DATABASE_URL'] = 'postgres://kyfadrupdtfyxa:feaaa7ce89472b2e5ac17ed499f28af5d5ac01258e510687cb2e781d0e0143c4@ec2-174-129-41-23.compute-1.amazonaws.com:5432/d7qp8gj8vfidv1'
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
# Uploads
UPLOAD_FOLDER = 'webapp/static/img/tmp/'
UPLOAD_URL = 'static/img/tmp/'