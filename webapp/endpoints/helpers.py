from datetime import date
from operator import eq
from werkzeug import secure_filename

import os

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'gif'])

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
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def save_image(img):
    filename = None
    url = None
    if img and allowed_file(img.filename):
        base_filename = secure_filename(img.filename).rsplit('.', 1)[0]
        extension = secure_filename(img.filename).rsplit('.', 1)[1]
        if not os.path.exists(application.config['UPLOAD_FOLDER']):
            os.makedirs(application.config['UPLOAD_FOLDER'])
        filename = base_filename + '.' + extension
        url = os.path.join(application.config['UPLOAD_FOLDER'], filename)
        index = 1
        while os.path.exists(url):
            filename = base_filename + '(' + str(index) + ').' + extension
            url = os.path.join(application.config['UPLOAD_FOLDER'], filename)
            index += 1
        img.save(url)
        url = os.path.join(application.config['UPLOAD_URL'], filename)
    return filename, url