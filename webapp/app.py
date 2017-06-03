from flask import request, render_template
from datetime import datetime, date
from webapp import application, db
from models import *
from helpers import get_date, getMER
from random import *

@application.route('/')
def index():
    return render_template('index.html')


def init():
    try:
        dog = Dog.query.filter(Dog._name=='Pluto').first()
        if dog is None:
            dog = Dog('Pluto', 'Lab Mix', datetime.strptime('07012016', '%m%d%Y'),'lb', 25, 30, date(2017, 1, 3))
            db.session.add(dog)
            db.session.commit()
        else:
            return {}
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
                    weight = randint(20, 30)
                    log = Log(date(2017, i, j), dog.id, weight, round(getMER(weight, dog._metric)), totalCalories, totalDuration)
                    db.session.add(log)
                    db.session.commit()
                    caloriesSoFar = 0
                    for k in range(0, 3):
                        calories = randint(10, max(totalCalories - caloriesSoFar, 11))
                        food_log = FoodLog(round((calories * food._serving) / food._calories, 1), food.id, log.id)
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
