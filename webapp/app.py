from flask import request, render_template, send_file, jsonify
from flask_uploads import UploadSet, IMAGES, configure_uploads
from datetime import datetime
from dateutil import parser
from operator import eq
from webapp import application, db, images
from models import Dog, Log, Food, ExerciseLog
from helpers import createJsonResponse

import os
import json

@application.route('/')
def index():
    return render_template('index.html')

@application.route('/dog',methods=['POST'])
def getDog():
    try:
        dogId = request.json['id']
        dog = Dog.query.filter_by(id=dogId).first()
        if (dog is None):
            return createJsonResponse({})
        dogDetail = {
            'name': dog.dog_name,
            'breed': dog.breed,
            'birthday': dog.birthday.strftime('%m/%d/%Y'),
            'current': dog.current,
            'goal': dog.goal,
            'date': dog.date.strftime('%m/%d/%Y'),
            'metric': dog.metric,
            'id': str(dog.id)
        }
        return json.dumps(dogDetail)
    except Exception, e:
        return json.dumps(str(e))

@application.route('/dog/all',methods=['POST'])
def getDogs():
    dogList = []
    try:
        dogs = Dog.query.all()
        
        for dog in dogs:
            dogItem = {
                'name': dog.dog_name,
                'breed': dog.breed,
                'birthday': dog.birthday.strftime('%m/%d/%Y'),
                'current': dog.current,
                'goal': dog.goal,
                'date': dog.date.strftime('%m/%d/%Y'),
                'metric': dog.metric,
                'id': str(dog.id)
            }
            dogList.append(dogItem)
        return json.dumps(dogList)
    except Exception, e:
        return json.dumps(str(e))

@application.route('/dog/new',methods=['POST'])
def addNewDog():
    try:
        json_data = request.json
        
        name = json_data['name']
        breed = json_data['breed']
        birthday = parser.parse(json_data['birthday'])
        metric = json_data['metric']
        current = json_data['current']
        goal = json_data['goal']
        date = datetime.date.today()
        # filename = images.save(request.files['img'])
        # url = images.url(filename)
        dog = Dog(name, breed, birthday, metric, current, goal, date)

        db.session.add(dog)
        db.session.commit()

        return json.dumps(dog)

    except Exception, e:
        return json.dumps(str(e))

@application.route('/dog/log',methods=['POST'])
def getLog():
    try:
        dogId = request.json['id']
        logDate = request.json['date']
        log = Log.query.filter_by(dog_id=dogId, date=datetime.strptime(logDate, '%m%d%Y')).first()
        if (log is None):
            return createJsonResponse({})

        logItem = {
            'id': str(log.id),
            'date': log.date,
            'weight': log.weight,
            'image_filename': log.image_filename,
            'image_url': log.image_url,
            'foods': getFood(str(log.id)),
            'exercise': getExercise(str(log.id))
        }
        return json.dumps(log)

    except Exception, e:
        return json.dumps(str(e))

def getFood(logId):
    foodList = []
    try:
        foods = Food.query.filter_by(log_id=logId)
        
        for food in foods:
            foodItem = {
                'food': food.food,
                'food_amount': food.food_amount,
                'log_id': food.log_id,
                'id': str(food.id)
            }
            foodList.append(foodItem)
            print food.food;
        return foodList
    except Exception, e:
        # return json.dumps(str(e))
        raise e

def getExercise(logId):
    exerciseList = []
    try:
        exerciseLog = ExerciseLog.query.filter_by(log_id=logId)
        
        for exercise in exerciseLog:
            exerciseData = {
                'exercise_type': exercise.exercise_type,
                'length': exercise.length,
                'log_id': exercise.log_id,
                'id': str(exercise.id)
            }
            exerciseList.append(exerciseData)
        return exerciseList
    except Exception, e:
        # return json.dumps({
        #     'status': 'ERROR',
        #     'error': str(e)
        # })
        raise e
        

@application.route('/dog/update',methods=['POST'])
def updateDog():
    try:
        json_data = request.json['data']

        dog = Dog.query.filter_by(id=json_data['id']).first()
        dog.name = json_data['name']
        dog.breed = json_data['breed']
        dog.birthday = json_data['birthday']
        dog.current = json_data['current']
        dog.goal = json_data['goal']

        db.session.commit()
        return jsonify(status='OK',message='updated successfully')
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))
        
@application.route('/dog/delete',methods=['POST'])
def deleteDog():
    try:
        dog = Dog.query.filter_by(id=json_data['id']).first()
        db.session.delete(dog)
        db.session.commit()
        return jsonify(status='OK', message='deletion successful')
    except Exception, e:
        return jsonify(status='ERROR', message=str(e))
