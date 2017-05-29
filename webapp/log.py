from flask import request
from webapp import application, db
from datetime import date
from models import Log, ExerciseLog, FoodLog, Food, Exercise

import json

@application.route('/log', methods=['POST'])
def get_log():
    try:
        dog_id = request.json.get('id')
        log_date = get_date(request.json.get('date'))
        log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        if log is None:
            log = Log(log_date, None, dog_id)
            db.session.add(log)
            return json.dumps(log.to_json())
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
            food = Food.query.filter(Food.id==log.food_id).first()
            print food.id
            foods.append({
                'amount': log._amount,
                'name': food._name,
                'calories': food._calories * log._amount / food._serving,
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

def get_date(string):
    return date(int(string[4:]), int(string[:2]), int(string[2:4]))