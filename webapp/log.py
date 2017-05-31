from flask import request
from webapp import application, db
from models import Log, ExerciseLog, FoodLog, Food, Exercise, Dog
from helpers import get_date, getMER

import json

@application.route('/log', methods=['POST'])
def get_log():
    try:
        dog_id = request.json.get('id')
        log_date = get_date(request.json.get('date'))
        log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        if log is None:
            return json.dumps({})

        log_item = log.to_json()
        dog = Dog.query.filter(Dog.id==dog_id).first()
        log_item['dailyCalories'] = round(getMER(log._weight, dog._metric))

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

@application.route('/log/update', methods=['POST'])
def update_log():
    try:
        dog_id = request.json.get('dogId')
        log_date = get_date(request.json.get('date'))
        update = request.json.get('updated')
        if update.get('id') is None:
            log = Log.query.filter(Log.dog_id==dog_id, Log._date==log_date).first()
        else:
            log = Log.query.filter(Log.id==update.get('id')).first()
        if log is None:
            log = Log(log_date, update.get('weight', 0), dog_id, update.get('totalCalories', 0), update.get('totalDuration', 0))
        else:
            log._weight = update.get('weight', log._weight)
            log._totalCalories = update.get('totalCalories', log._totalCalories)
            log._totalDuration = update.get('totalDuration', log._totalDuration)

        db.session.add(log)
        db.session.commit()
        log_item = log.to_json()
        dog = Dog.query.filter(Dog.id==dog_id).first()
        log_item['dailyCalories'] = round(getMER(log._weight, dog._metric))
        return json.dumps()

    except Exception, e:
        return json.dumps(str(e)), 500