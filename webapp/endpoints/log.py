from werkzeug import secure_filename
from flask import request

from webapp.models import *
from webapp.helpers import *
from webapp import application, db

import json
import os

@application.route('/log', methods=['POST'])
def get_log():
    try:
        dog_id = request.json.get('id')
        log_date = get_date(request.json.get('date'))
        log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        if log is None:
            return json.dumps({})
        log_item = log.to_json()
        log_item.update({'food': get_food_log(log.id)})
        log_item.update({'exercise': get_exercise_log(log.id)})
        return json.dumps(log_item)
    except Exception, e:
        return json.dumps(str(e)), 500

def get_food_log(log_id):
    foods = []
    try:
        food_log = FoodLog.query.filter(FoodLog.log_id==log_id).all()
        for log in food_log:
            if log.log_id is None:
                db.session.delete(log)
                db.session.commit()
            food = Food.query.filter(Food.id==log.food_id).first()
            foods.append({
                'amount': log._amount,
                'name': food._name,
                'calories': round(food._calories * log._amount / food._serving, 1),
                'foodId': food.id,
                'id': log.id
            })
        return foods
    except Exception, e:
        raise e

def get_exercise_log(log_id):
    exercises = []
    try:
        exercise_logs = ExerciseLog.query.filter(ExerciseLog.log_id==log_id).all()
        
        for log in exercise_logs:
            exercise = Exercise.query.filter(Exercise.id==log.exercise_id).first()
            exercises.append({
                'duration': log._duration,
                'intensity': log._intensity,
                'name': exercise._name,
                'description': exercise._description,
                'exerciseId': exercise.id,
                'id': log.id
            })
        return exercises

    except Exception, e:
        raise e

@application.route('/log/delete', methods=['POST'])
def delete_log():
    try:
        log_id = request.json.get('id')
        log = Log.query.filter_by(id=log_id).first()
        exercise_logs = ExerciseLog.query.filter(ExerciseLog.log_id==log_id).all()
        for exercise_log in exercise_logs:
            db.session.delete(exercise_log)
        food_logs = FoodLog.query.filter(FoodLog.log_id==log_id).all()
        for food_log in food_logs:
            db.session.delete(food_log)
        db.session.delete(log)
        db.session.commit()
        return json.dumps({
            'message': 'Successfully deleted'
        })

    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/log/update/image', methods=['POST'])
def update_log_image():
    filename = None
    try:
        filename, url = save_image(request.files['image'])
        print filename, url
        dog_id = request.form.get('dogId')
        log_date = get_date(request.form.get('date'))
        log_id = request.form.get('logId')
        if log_id is None or str(log_id) == 'undefined':
            log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        else:
            log = Log.query.filter(Log.id==log_id).first()

        if log is None:
            log = Log(log_date, dog_id, 0, image_filename=filename, image_url=url)
        else:
            if url and log._image_filename:
                delete_image(log._image_filename)
            log._image_url = url or log._image_url
            log._image_filename = filename

        db.session.add(log)
        db.session.commit()
        return json.dumps(log.to_json())

    except Exception, e:
        if filename is not None:
            delete_image(filename)
        return json.dumps(str(e)), 500

@application.route('/log/update/weight', methods=['POST'])
def update_log_weight():
    try:
        dog_id = request.json.get('dogId')
        dog = Dog.query.filter(Dog.id==dog_id).first()
        log_date = get_date(request.json.get('date'))
        log_id = request.json.get('logId')
        if log_id is None:
            log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        else:
            log = Log.query.filter(Log.id==log_id).first()

        if log is None:
            log = Log(log_date, dog_id, request.json.get('weight', 0))
        else:
            log._weight = request.json.get('weight', log._weight)

        log._daily_calories = round(getMER(log._weight, dog._metric))
        db.session.add(log)
        db.session.commit()
        return json.dumps(log.to_json())

    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/log/update/duration', methods=['POST'])
def update_log_duration():
    try:
        dog_id = request.json.get('dogId')
        log_date = get_date(request.json.get('date'))
        log_id = request.json.get('logId')
        if log_id is None:
            log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        else:
            log = Log.query.filter(Log.id==log_id).first()

        if log is None:
            log = Log(log_date, dog_id, total_duration=request.json.get('totalDuration', 0))
        else:
            log._total_duration = request.json.get('totalDuration', log._total_duration)
        db.session.add(log)
        db.session.commit()
        return json.dumps(log.to_json())

    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/log/update/calories', methods=['POST'])
def update_log_calories():
    try:
        dog_id = request.json.get('dogId')
        log_date = get_date(request.json.get('date'))
        log_id = request.json.get('logId')
        if log_id is None:
            log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        else:
            log = Log.query.filter(Log.id==log_id).first()

        if log is None:
            log = Log(log_date, dog_id, 0, total_calories=request.json.get('totalCalories', 0))
        else:
            log._total_calories = request.json.get('totalCalories', log._total_calories)

        db.session.add(log)
        db.session.commit()
        return json.dumps(log.to_json())

    except Exception, e:
        return json.dumps(str(e)), 500
