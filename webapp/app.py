from flask import request, render_template, send_file, jsonify
from datetime import datetime
from webapp import application, db, images
from models import Dog, Log
from helpers import get_date

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
        logs = Log.query.filter(Log.dog_id == dog_id, Log._date >= get_date(start_date), Log._date <= get_date(end_date))
        weights = []
        foods = []
        exercise = []
        for log in logs:
            weights.append([log._date.strftime('%m/%d/%Y'), log._weight])
            foods.append([log._date.strftime('%m/%d/%Y'), log._totalCalories])
            exercise.append([log._date.strftime('%m/%d/%Y'), log._totalDuration])
        return json.dumps([{'data': weights}, {'data': foods}, {'data': exercise}])

    except Exception, e:
        return json.dumps(str(e)), 500

def init():
    try:
        dog = Dog.query.filter(Dog._name=='Pluto').first()
        if dog is None:
            dog = Dog('Pluto', 'Lab Mix', datetime.strptime('07012016', '%m%d%Y'),'lb', 25, 30, datetime.now())
            db.session.add(dog)
            db.session.commit()
        return {}
    except Exception, e:
        raise e

init()
