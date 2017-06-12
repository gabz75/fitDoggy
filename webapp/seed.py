from sqlalchemy import desc
from datetime import datetime, date, timedelta
from webapp import db
from random import randint
from helpers import getMER

today = datetime.now().replace(hour=0,minute=0,second=0,microsecond=0)

def demo():
    user = demo_user()
    run, walk = demo_exercise()
    food = demo_food()
    dog = demo_dog(user.id)
    logs = demo_logs(dog, food, run, walk)

def demo_user():
    from models import User
    user = User.query.filter(User._username=='demo').first()
    if user is None:
        user = User('demo', 'demo', 'example@example.com')
        db.session.add(user)
        db.session.commit()
        print 'User id is ' + str(user.id)
    return user

def demo_exercise():
    from models import Exercise
    run = Exercise.query.filter(Exercise._name=='Run').first()
    walk = Exercise.query.filter(Exercise._name=='Walk').first()
    if run is None:
        run = Exercise('Run', '4 mph')
        db.session.add(run)
        db.session.commit()
        print 'Run id is ' + str(run.id)
    if walk is None:
        walk = Exercise('Walk', '2 mph')
        db.session.add(walk)
        db.session.commit()
        print 'Walk id is ' + str(walk.id)
    return run, walk

def demo_food():
    from models import Food
    food = Food.query.filter(Food._name=='Blue - Chicken and Brown Rice Recipe').first()
    if food is None:
        food = Food('Blue - Chicken and Brown Rice Recipe', 378, 8)
        db.session.add(food)
        db.session.commit()
        print 'Food id is ' + str(food.id)
    return food

def demo_dog(user_id):
    from models import Dog
    dog = Dog.query.filter(Dog._name=='Pluto', Dog.user_id==user_id).first()
    creation_date = today - timedelta(days=7)
    weight = 25
    goal_weight = 30
    birthday = datetime.strptime('07012016', '%m%d%Y')
    filename = 'Pluto'
    url = 'https://s3-us-west-1.amazonaws.com/fitdoggy-data/Pluto.jpg'
    if dog is None:
        dog = Dog('Pluto', 'Lab Mix', birthday, 'lb', weight, goal_weight, creation_date.date(), user_id, filename, url)
        print 'Dog id is new'
    else:
        dog._name = 'Pluto'
        dog._breed = 'Lab Mix'
        dog._birthday = birthday
        dog._current = weight
        dog._goal = goal_weight
        dog._metric = 'lb'
        dog._date = creation_date.date()
        dog.user_id = user_id
        dog._image_url = url
        dog._image_filename = filename
    db.session.add(dog)
    db.session.commit()
    return dog

def demo_logs(dog, food, run, walk):
    from models import Log, ExerciseLog, FoodLog
    logs = Log.query.filter(Log.dog_id==dog.id).order_by(desc(Log._date)).all() or [None] * 10
    d = today
    index = 1
    weight = 25
    calories = randint(400, 600)
    for log in logs:
        daily_calories = round(getMER(weight, dog._metric))
        filename = None
        url = None
        filename = 'Pluto' + str(index)
        url = 'https://s3-us-west-1.amazonaws.com/fitdoggy-data/Pluto' + str(index) + '.jpg'
        if log is None:
            log = Log(d, dog.id, weight, daily_calories, calories, None, filename, url)
            print 'log is new'

            db.session.add(log)
            db.session.commit()
        else:
            log._date = d
            log._weight = weight
            log._daily_calories = daily_calories
            log._calories = calories
            log._image_filename = filename
            log._image_url = url

        food_log = FoodLog.query.filter(FoodLog.food_id==food.id, FoodLog.log_id==log.id).first()
        if food_log is None:
            food_log = FoodLog(round((calories * food._serving) / food._calories, 1), food.id, log.id)
        db.session.add(food_log)

        duration = randint(10, 100)
        run_log = ExerciseLog.query.filter(ExerciseLog.exercise_id==run.id, ExerciseLog.log_id==log.id).first()
        if run_log is None:
            run_log = ExerciseLog(duration, 'Moderate', run.id, log.id)
        db.session.add(run_log)
        db.session.commit()
        total_duration = duration

        duration = randint(10, 100)
        walk_log = ExerciseLog.query.filter(ExerciseLog.exercise_id==walk.id, ExerciseLog.log_id==log.id).first()
        if walk_log is None:
            walk_log = ExerciseLog(duration, 'Moderate', walk.id, log.id)
        db.session.add(walk_log)
        db.session.commit()
        total_duration += duration

        log._total_duration = total_duration
        db.session.add(log)
        db.session.commit()
        logs[index - 1] = log
        d -= timedelta(days=1)
        weight += randint(-1, 1)
        index += 1
        calories += randint(10, 50)
    print len(ExerciseLog.query.all())
    return logs
