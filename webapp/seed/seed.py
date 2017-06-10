def seed():
    try:
        user = User.query.filter(User._username=='demo').first()
        if user is None:
            user = User('demo', 'demo', 'example@example.com')
            db.session.add(user)
            db.session.commit()
        run = Exercise.query.filter(Exercise._name=='Run').first()
        if run is None:
            run = Exercise('Run', '4 mph')
            db.session.add(run)
            db.session.commit()
        walk = Exercise.query.filter(Exercise._name=='Walk').first()
        if walk is None:
            walk = Exercise('Walk', '2 mph')
            db.session.add(walk)
            db.session.commit()
        dog = Dog.query.filter(Dog._name=='Pluto').first()
        if dog is None:
            creation_date = datetime.combine(date(2017, 1, 1), datetime.min.time())
            dog = Dog('Pluto', 'Lab Mix', datetime.strptime('07012016', '%m%d%Y'),'lb', 25, 30, date(2017, 1, 1), user.id, 'Pluto', 'https://s3-us-west-1.amazonaws.com/fitdoggy-data/Pluto.jpg')
            db.session.add(dog)
            db.session.commit()
        else:
            creation_date = dog._date
        
        food = Food.query.filter(Food._name=='Blue - Chicken and Brown Rice Recipe').first()
        if food is None:
            food = Food('Blue - Chicken and Brown Rice Recipe', 378, 8)
            db.session.add(food)
            db.session.commit()
        log = Log.query.filter(Log.dog_id==dog.id).all()
        photo_index = 1
        if len(log) is 0:
            date_list = [creation_date + timedelta(days=x) for x in range(0, 160)]
            for d in date_list:
                total_calories = randint(10, 700)
                total_duration = randint(10, 120)
                weight = randint(20, 30)
                filename = None
                url = None
                if d >= creation_date + timedelta(days=152):
                    filename = 'Pluto' + str(photo_index)
                    url = 'https://s3-us-west-1.amazonaws.com/fitdoggy-data/Pluto' + str(photo_index) + '.jpg'
                    photo_index += 1
                log = Log(d, dog.id, weight, round(getMER(weight, dog._metric)), total_calories, total_duration, filename, url)
                db.session.add(log)
                db.session.commit()
                calories_so_far = 0
                for k in range(0, 3):
                    calories = randint(10, max(total_calories - calories_so_far, 11))
                    food_log = FoodLog(round((calories * food._serving) / food._calories, 1), food.id, log.id)
                    db.session.add(food_log)
                    calories_so_far += calories
                    if calories_so_far >= total_calories:
                        break
                log._total_calories = calories_so_far
                duration_so_far = 0
                for k in range(0, 4):
                    exercise = run if randint(0, 2) == 1 else walk
                    duration = randint(10, max(total_duration - duration_so_far, 11))
                    exercise_log = ExerciseLog(duration, 'Moderate', exercise.id, log.id)
                    db.session.add(exercise_log)
                    duration_so_far += duration
                    if duration_so_far >= total_duration:
                        break
                log._total_duration = duration_so_far
                db.session.add(log)
                db.session.commit()
        return {}
    except Exception, e:
        raise e