from flask import request, render_template, send_file, jsonify
from datetime import datetime, date
from webapp import application, db, images
from models import *
from helpers import get_date, getMER
from random import *

import os
import json

@application.route('/')
def index():
    return render_template('index.html')

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

@application.route('/dog/new', methods=['POST'])
def add_new_dog():
    try:
        json_data = request.json
        name = json_data.get('name')
        breed = json_data.get('breed', '')
        birthday = datetime.strptime(json_data.get('birthday'), '%m%d%Y')
        metric = json_data.get('metric')
        current = json_data.get('current')
        goal = json_data.get('goal')
        date = datetime.now()
        # filename = images.save(request.files.get('img'))
        # url = images.url(filename)
        dog = Dog(name, breed, birthday, metric, current, goal, date)

        db.session.add(dog)
        db.session.commit()

        return json.dumps(dog.to_json())

    except Exception, e:
        return json.dumps(str(e)), 500

@application.route('/dog/update', methods=['POST'])
def update_dog():
    try:
        json_data = request.json.get('data')

        dog = Dog.query.filter_by(id=json_data.get('id')).first()
        dog.name = json_data.get('name')
        dog.breed = json_data.get('breed')
        dog.birthday = json_data.get('birthday')
        dog.current = json_data.get('current')
        dog.goal = json_data.get('goal')

        db.session.commit()
        return json.dumps(dog)

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
        print start_date, end_date
        logs = Log.query.filter(Log.dog_id == dog_id, Log._date >= get_date(start_date), Log._date <= get_date(end_date))
        weights = []
        foods = []
        exercise = []
        for log in logs:
            timestamp = int(datetime.combine(log._date, datetime.min.time()).strftime('%s'))*1000

            weights.append([timestamp, log._weight])
            foods.append([timestamp, log._totalCalories])
            exercise.append([timestamp, log._totalDuration])
        return json.dumps([[{'name': 'Weights', 'data': weights}], [{'name': 'Food', 'data': foods}], [{'name': 'Exercise', 'data': exercise}]])

    except Exception, e:
        return json.dumps(str(e)), 500

def init():
    try:
        dog = Dog.query.filter(Dog._name=='Pluto').first()
        if dog is None:
            dog = Dog('Pluto', 'Lab Mix', datetime.strptime('07012016', '%m%d%Y'),'lb', 25, 30, date(2017, 1, 3))
            db.session.add(dog)
            db.session.commit()
        exercise = Exercise.query.filter(Exercise._name=='Run').first()
        if exercise is None:
            exercise = Exercise('Run', '4 mph')
            db.session.add(exercise)
            db.session.commit()
        food = Food.query.filter(Food._name=='Blue - Chicken and Brown Rice Recipe').first()
        if food is None:
            food = Food('Blue - Chicken and Brown Rice Recipe', 378, 8)
            db.session.add(food)
            db.session.commit()
        log = Log.query.filter(Log.dog_id==dog.id).first()
        if log is None:
            for i in range(1, 6):
                for j in range(3, 29):
                    totalCalories = randint(10, 700)
                    totalDuration = randint(10, 120)
                    log = Log(date(2017, i, j), randint(20, 30), dog.id, totalCalories, totalDuration)
                    db.session.add(log)
                    db.session.commit()
                    caloriesSoFar = 0
                    for k in range(0, 3):
                        calories = randint(10, max(totalCalories - caloriesSoFar, 11))
                        food_log = FoodLog(calories / food._calories * food._serving, food.id, log.id)
                        if log.id == 4:
                            print calories, food._calories, food._serving, calories / food._calories * food._serving
                        db.session.add(food_log)
                        caloriesSoFar += calories
                        if caloriesSoFar >= totalCalories:
                            break
                    durationSoFar = 0
                    for k in range(0, 3):
                        duration = randint(10, max(totalDuration - durationSoFar, 11))
                        exercise_log = ExerciseLog(duration, 'Moderate', exercise.id, log.id)
                        db.session.add(exercise_log)
                        durationSoFar += duration
                        if durationSoFar >= totalDuration:
                            break
        db.session.commit()
        return {}
    except Exception, e:
        raise e

init()
