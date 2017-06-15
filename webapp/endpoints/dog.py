from sqlalchemy import asc
from flask import request, render_template, session, g
from flask_login import current_user
from datetime import datetime

from webapp import application, db
from webapp.models import Dog, Log
from webapp.helpers import *

import os
import json

@application.route('/dog', methods=['POST'])
def get_dog():
    try:
        dog_id = request.json.get('id')
        dog = Dog.query.filter(Dog.id==dog_id).first()
        if (dog is None):
            return json.dumps({})
        return json.dumps(dog.to_json())
    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.route('/dog/all', methods=['POST'])
def get_dogs():
    dogList = []
    try:
        dogs = Dog.query.filter(Dog.user_id==session.get('user_id'))
        for dog in dogs:
            dogList.append(dog.to_json())
        return json.dumps(dogList)
    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.route('/dog/update', methods=['POST'])
def update_dog():
    filename = None
    if g.user is None:
        return json.dumps({
            'message': 'You must be logged in',
            'status': 'error'
        }), 500
    try:
        json_data = request.form
        name = json_data.get('name')
        breed = json_data.get('breed', '')
        birthday = datetime.strptime(json_data.get('birthday'), '%m%d%Y')
        metric = json_data.get('metric')
        current = json_data.get('current')
        goal = json_data.get('goal')
        date = datetime.now()
        filename, url = save_image(request.files.get('image'))
        if json_data.get('id') is None:
            dog = Dog(name, breed, birthday, metric, current, goal, date, g.user, filename, url)
        else:
            dog = Dog.query.filter(Dog.id==json_data.get('id')).first()
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
        delete_image(filename)
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.route('/dog/delete', methods=['POST'])
def delete_dog():
    try:
        dog_id = request.json.get('id')
        dog = Dog.query.filter_by(id=dog_id).first()
        logs = Log.query.filter(Log.dog_id==dog_id).all()
        for log in logs:
            delete_image(log._image_filename)
            exercise_logs = ExerciseLog.query.filter(ExerciseLog.log_id==log.id).all()
            for exercise_log in exercise_logs:
                db.session.delete(exercise_log)
            food_logs = FoodLog.query.filter(FoodLog.log_id==log.id).all()
            for food_log in food_logs:
                db.session.delete(food_log)
            db.session.delete(log)
        db.session.delete(dog)
        db.session.commit()
        return json.dumps({
            'message': 'Successfully deleted',
            'status': 'success'
        })

    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.route('/dog/data', methods=['POST'])
def dog_data():
    try:
        dog_id = request.json.get('id')
        dog = Dog.query.filter(Dog.id==dog_id).first()
        start_date = request.json.get('startDate')
        end_date = request.json.get('endDate')
        logs = Log.query.filter(Log.dog_id == dog_id, Log._date >= get_date(start_date), Log._date <= get_date(end_date)).order_by(asc(Log._date)).all()
        weights = []
        foods = []
        exercise = []
        image = []
        for log in logs:
            timestamp = int(datetime.combine(log._date, datetime.min.time()).strftime('%s'))*1000
            weights.append([timestamp, log._weight])
            foods.append([timestamp, log._total_calories])
            exercise.append([timestamp, log._total_duration])
            if log._image_url is not None:
                image.append({
                    'thumbnailUrl': log._thumbnail_url,
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
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.route('/dog/slideshow', methods=['POST'])
def dog_slideshow():
    try:
        images = []
        dogs = Dog.query.filter(Dog.user_id==session.get('user_id'))
        for dog in dogs:
            logs = Log.query.filter(Log.dog_id==dog.id).limit(5)
            for log in logs:
                if log._image_url is not None:
                    images.append({
                        'thumbnailUrl': log._thumbnail_url,
                        'url': log._image_url,
                        'filename': log._image_filename
                    })
        return json.dumps(images)

    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500
