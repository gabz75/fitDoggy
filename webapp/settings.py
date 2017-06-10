import os

os.environ['DATABASE_URL']= 'postgres://kyfadrupdtfyxa:feaaa7ce89472b2e5ac17ed499f28af5d5ac01258e510687cb2e781d0e0143c4@ec2-174-129-41-23.compute-1.amazonaws.com:5432/d7qp8gj8vfidv1'
os.environ['AWS_ACCESS_KEY_ID'] = 'AKIAIOZUQCHDQGXQSLUA'
os.environ['AWS_SECRET_ACCESS_KEY'] = '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'
os.environ['S3_BUCKET_NAME'] = 'fitdoggy-data'
os.environ['SECRET_KEY'] = 'Qe4PcIQZu6'
    
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.environ['SECRET_KEY']
# Uploads
UPLOAD_FOLDER = 'webapp/static/img/tmp/'
UPLOAD_URL = 'static/img/tmp/'