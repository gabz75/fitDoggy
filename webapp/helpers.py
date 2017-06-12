from datetime import date
from operator import eq
from random import randint
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
    filename = None
    url = None
    try:
        if img and allowed_file(img.filename):
            s3 = boto3.resource('s3')
            bucket = s3.Bucket(_S3_BUCKET)
            base_filename = secure_filename(img.filename).rsplit('.', 1)[0]
            filename = base_filename
            objs = list(bucket.objects.filter(Prefix=filename))
            index = 1
            while len(objs) > 0 and objs[0].key == filename:
                filename = base_filename + '(' + str(index) + ')'
                objs = list(bucket.objects.filter(Prefix=filename))
                index += 1
            print filename, url
            thumbnail = Image.open(img)
            img_w, img_h = img.size
            thumbnail = thumbnail.crop(calculate_size(img_w, img_h))
            s3.Object(_S3_BUCKET, filename).put(Body=img)
            s3.Object(_S3_BUCKET, filename + '-thumbnail').put(Body=thumbnail)
            url = 'https://s3-us-west-1.amazonaws.com/' + _S3_BUCKET + '/' + filename
        return filename, url
    except Exception, e:
        raise e

def calculate_size(w, h):
    aspect_ratios = [(1, 1), (2, 1)]
    aspect_ratio = aspect_ratios[randint(0, 2)]
    x1 = round(w / 2 - 50) if w > 50 else 0
    y1 = round(h / 2 - 50) if h > 50 else 0
    x2 = round(w / 2 + 50) if w > 50 else w
    y2 = round(h / 2 + 50) if h > 50 else h
    print x1, y1, x2, y2
    return x1, y1, x2, y2

def delete_image(filename):
    s3 = boto3.resource('s3')
    s3.Object(_S3_BUCKET, filename).delete()
    s3.Object(_S3_BUCKET, filename + '-thumbnail').delete()
    return True



    