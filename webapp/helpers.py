import cStringIO as StringIO
from datetime import date, datetime
from operator import eq
from random import randint, choice
from werkzeug import secure_filename
from PIL import Image

import os
import boto3

_ALLOWED_EXTENSIONS = set(['png', 'jpg', 'gif'])
_S3_BUCKET = os.environ.get('S3_BUCKET_NAME')
_S3_REGION = os.environ.get('S3_REGION')
_S3_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY_ID')
_S3_SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

def convertToLB(kg):
    return kg * 2.20462

def convertToKG(lb):
    return lb / 2.20462

def getMER(weight, metric):
	if eq(metric, 'lb'):
		return 110 * pow(convertToKG(weight), 0.75)
	return 110 * pow(weight, 0.75)

def get_date(string):
    return date(int(string[4:]), int(string[:2]), int(string[2:4])) 

def allowed_file(filename):
    return '.' in filename and \
       filename.rsplit('.', 1)[1] in _ALLOWED_EXTENSIONS

def save_image(img):
    base_filename = None
    url = None
    try:
        if img and allowed_file(img.filename):
            s3 = boto3.resource('s3')
            base_filename = secure_filename(img.filename).rsplit('.', 1)[0] + datetime.now().isoformat()
            extension = secure_filename(img.filename).rsplit('.', 1)[1]
            filename = base_filename + '.' + extension
            s3.Object(_S3_BUCKET, filename).put(Body=img)
            
            thumbnail = Image.open(img)
            img_w, img_h = thumbnail.size
            crop, aspect_ratio = calculate_size(img_w, img_h)
            thumbnail = thumbnail.crop(crop)
            file = StringIO.StringIO()
            thumbnail.save(file, format='PNG')
            
            s3.Object(_S3_BUCKET, base_filename + '-thumbnail.png').put(Body=file.getvalue())
            url = 'https://s3-us-west-1.amazonaws.com/' + _S3_BUCKET + '/' + filename
        return base_filename, url
    except Exception, e:
        raise e
    return None, None

def calculate_size(w, h):
    aspect_ratio = (1, 1) if w > h else (1, 2)
    if w > h:
        padding = h / 2;
        x1 = w / 2 - padding
        y1 = 0
        x2 = w / 2 + padding
        y2 = h
    else:
        x1, y1 = 0, 0
        x2 = min(w, h / 2)
        y2 = 2 * x2
    return (x1, y1, x2, y2)



def delete_image(filename):
    if filename is None:
        return True
    s3 = boto3.resource('s3')
    s3.Object(_S3_BUCKET, filename).delete()
    s3.Object(_S3_BUCKET, filename + '-thumbnail').delete()
    return True

    