from flask import request, render_template, send_file, jsonify
from werkzeug import secure_filename
from datetime import datetime

from webapp import application, db
from webapp.models import Dog, Log
from helpers import *

import os
import json

@application.route('/dog', methods=['POST'])
def get_dog():
    try:
        dog_id = request.json.get('id')
        dog = Dog.query.filter_by(id=dog_id).first()
        if (dog is None):
            return json.dumps({})
        return json.dumps(dog.to_json())
    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/dog/all', methods=['POST'])
def get_dogs():
    dogList = []
    try:
        dogs = Dog.query.all()
        for dog in dogs:
            dogList.append(dog.to_json())
        return json.dumps(dogList)
    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/dog/update', methods=['POST'])
def update_dog():
    try:
        json_data = request.form
        name = json_data.get('name')
        breed = json_data.get('breed', '')
        birthday = datetime.strptime(json_data.get('birthday'), '%m%d%Y')
        metric = json_data.get('metric')
        current = json_data.get('current')
        goal = json_data.get('goal')
        date = datetime.now()
        img = request.files['image']
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
        if json_data.get('id') is None:
            dog = Dog(name, breed, birthday, metric, current, goal, date, filename, url)
        else:
            dog = Dog.query.filter_by(id=json_data.get('id')).first()
            dog._name = name or dog._name
            dog._breed = breed or dog._breed
            dog._birthday = birthday or dog._birthday
            dog._current = current or dog._current
            dog._goal = goal or dog._goal
            dog._metric = metric or dog._metric
            dog._image_url = url or dog._image_url
            dog._image_filename = filename or dog._image_filename

        db.session.add(dog)
        db.session.commit()
        return json.dumps(dog.to_json())

    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/dog/delete', methods=['POST'])
def delete_dog():
    try:
        dog_id = request.json.get('id')
        dog = Dog.query.filter_by(id=dog_id).first()
        
        db.session.delete(dog)
        db.session.commit()
        return json.dumps({
            'message': 'Successfully deleted'
        })

    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/dog/data', methods=['POST'])
def dog_data():
    try:
        dog_id = request.json.get('id')
        start_date = request.json.get('startDate')
        end_date = request.json.get('endDate')
        logs = Log.query.filter(Log.dog_id == dog_id, Log._date >= get_date(start_date), Log._date <= get_date(end_date))
        weights = []
        foods = []
        exercise = []
        image = []
        for log in logs:
            timestamp = int(datetime.combine(log._date, datetime.min.time()).strftime('%s'))*1000
            weights.append([timestamp, log._weight])
            foods.append([timestamp, log._totalCalories])
            exercise.append([timestamp, log._totalDuration])
            if log._image_url is not None:
                image.append({
                    'url': log._image_url,
                    'filename': log._image_filename
                })
        return json.dumps([[
            {'name': 'Weights', 
            'data': weights
            }], [{
            'name': 'Food', 
            'data': foods
            }], [{
            'name': 'Exercise', 
            'data': exercise
        }], image])

    except Exception, e:
        return json.dumps(str(e)), 500
