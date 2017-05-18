from flask import request, render_template, send_file
from webapp import application, db

import os
import json

@application.route('/')
def index():
    return render_template('index.html')

@application.route('/addDog',methods=['POST'])
def addDog():
    try:
        json_data = request.json['info']
        name = json_data['name']
        breed = json_data['breed']
        age = json_data['age']
        weight = json_data['weight']
        password = json_data['age']

        dog = {
            'name': deviceName,
            'breed': breed,
            'age': age,
            'current': weight['current'],
            'goal': weight['goal'],
            'date': time.strftime('%d/%m/%Y')
        }

        db.Dogs.insert_one(dog)
        return jsonify(status='OK', dog=dog)

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))

@application.route('/getDogs',methods=['POST'])
def getMachineList():
    try:
        dogs = db.Dogs.find()
        
        dogList = []
        for dog in dogs:
            dogItem = {
                    'name': dog['name'],
                    'breed': dog['breed'],
                    'age': dog['age'],
                    'current': dog['current'],
                    'goal': dog['goal'],
                    'date': dog['date'],
                    'id': str(dog['_id'])
            }
            dogList.append(dogItem)
    except Exception,e:
        return str(e)
    return json.dumps(dogItem)

@application.route('/getDog',methods=['POST'])
def getDog():
    try:
        dogId = request.json['id']
        dog = db.Machines.find_one({'_id':ObjectId(dogId)})
        dogDetail = {
            'name': dog['name'],
            'breed': dog['breed'],
            'age': dog['age'],
            'current': dog['current'],
            'goal': dog['goal'],
            'date': dog['date'],
            'id': str(dog['_id'])
        }
        return json.dumps(dogDetail)
    except Exception, e:
        return str(e)

@application.route('/updateDog',methods=['POST'])
def updateMachine():
    try:
        machineInfo = request.json['info']
        machineId = machineInfo['id']
        device = machineInfo['device']
        ip = machineInfo['ip']
        username = machineInfo['username']
        password = machineInfo['password']
        port = machineInfo['port']

        db.Machines.update_one({'_id':ObjectId(machineId)},{'$set':{'device':device,'ip':ip,'username':username,'password':password,'port':port}})
        return jsonify(status='OK',message='updated successfully')
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))
        
@application.route('/deleteDog',methods=['POST'])
def deleteMachine():
    try:
        machineId = request.json['id']
        db.Machines.remove({'_id':ObjectId(machineId)})
        return jsonify(status='OK',message='deletion successful')
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))
