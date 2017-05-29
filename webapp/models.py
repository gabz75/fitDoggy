from webapp import application, db

class Dog(db.Model):
    __tablename__ = 'dog'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    _name = db.Column(db.String(128))
    _breed = db.Column(db.String(128))
    _birthday = db.Column(db.Date)
    _metric = db.Column(db.String(2))
    _current = db.Column(db.Float)
    _goal = db.Column(db.Float)
    _date = db.Column(db.Date)
    _image_filename = db.Column(db.String, default=None, nullable=True)
    _image_url = db.Column(db.String, default=None, nullable=True)
    
    logs = db.relationship('Log', back_populates='dog')

    def __init__(self, _name, breed, birthday, metric, current, goal, date, image_filename=None, image_url=None):
        self._name = _name
        self._breed = breed
        self._birthday = birthday
        self._metric = metric
        self._current = current
        self._goal = goal
        self._date = date
        self._image_filename = image_filename
        self._image_url = image_url 

    def to_json(self):
        return {
            'name': self._name,
            'breed': self._breed,
            'birthday': self._birthday.strftime('%m/%d/%Y'),
            'current': self._current,
            'goal': self._goal,
            'date': self._date.strftime('%m/%d/%Y'),
            'metric': self._metric,
            'id': str(self.id)
        }

class Log(db.Model):
    __tablename__ = 'log'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    _date = db.Column(db.Date())
    _weight = db.Column(db.Float, default=None, nullable=True)
    _image_filename = db.Column(db.String, default=None, nullable=True)
    _image_url = db.Column(db.String, default=None, nullable=True)

    food_logs = db.relationship('FoodLog', back_populates='log')
    exercise_logs = db.relationship('ExerciseLog', back_populates='log')

    dog_id = db.Column(db.Integer, db.ForeignKey('dog.id'))
    dog = db.relationship('Dog', back_populates='logs')


    def __init__(self, date, weight, dog_id, image_filename=None, image_url=None):
        self._date = date
        self._weight = weight
        self.dog_id = dog_id
        self._image_filename = image_filename
        self._image_url = image_url 

    def to_json(self):
        return {
            'id': str(self.id),
            'date': self._date.strftime('%m/%d/%Y'),
            'weight': self._weight,
            'image_filename': self._image_filename,
            'image_url': self._image_url
        }

class FoodLog(db.Model):
    __tablename__ = 'foodlog'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    _amount = db.Column(db.Integer)

    food_id = db.Column(db.Integer, db.ForeignKey('food.id'))

    log_id = db.Column(db.Integer, db.ForeignKey('log.id'))
    log = db.relationship('Log', back_populates='food_logs')

    def __init__(self, amount, food_id, log_id):
        self._amount = amount
        self.food_id = food_id
        self.log_id = log_id

class ExerciseLog(db.Model):
    __tablename__ = 'exerciselog'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    _duration = db.Column(db.Float)
    _intensity = db.Column(db.String(128))

    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'))

    log_id = db.Column(db.Integer, db.ForeignKey('log.id'))
    log = db.relationship('Log', back_populates='exercise_logs')

    def __init__(self, duration, intensity, exercise_id, log_id):
        self._duration = duration
        self._intensity = intensity
        self.exercise_id = exercise_id
        self.log_id = log_id


class Exercise(db.Model):
    __tablename__ = 'exercise'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    _name = db.Column(db.String(128))
    _description = db.Column(db.String(128))

    def __init__(self, name, description):
        self._name = name
        self._description = description

    def to_json(self):
        return {
            'name': self._name,
            'description': self._description,
            'id': str(self.id)
        }

class Food(db.Model):
    __tablename__ = 'food'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    _name = db.Column(db.String(128))
    _calories = db.Column(db.Integer)
    _serving = db.Column(db.Float)

    def __init__(self, food, calories, serving):
        self._name = food
        self._calories = calories
        self._serving = serving

    def to_json(self):
        return {
            'name': self._name,
            'calories': self._calories,
            'serving': self._serving,
            'id': str(self.id)
        }

# db.drop_all()
db.create_all()

# application.config['API_MODELS'] = {
#     'dog': Dog,
#     'log': Log,
#     'exercise': Exercise,
#     'exerciselog': ExerciseLog,
#     'food': Food,
#     'foodlog': FoodLog
# }
# application.config['CRUD_URL_MODELS'] = {
#     'dog': Dog,
#     'log': Log,
#     'exercise': Exercise,
#     'exerciselog': ExerciseLog,
#     'food': Food,
#     'foodlog': FoodLog
# }