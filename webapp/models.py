from webapp import application, db

class Dog(db.Model):
    __tablename__ = 'dog'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dog_name = db.Column(db.String(128))
    breed = db.Column(db.String(128))
    birthday = db.Column(db.Date)
    metric = db.Column(db.String(2))
    current = db.Column(db.Float)
    goal = db.Column(db.Float)
    date = db.Column(db.Date)
    image_filename = db.Column(db.String, default=None, nullable=True)
    image_url = db.Column(db.String, default=None, nullable=True)
    logs = db.relationship('Log', back_populates='dog')

    def __init__(self, dog_name, breed, birthday, metric, current, goal, date, image_filename=None, image_url=None):
        self.dog_name = dog_name
        self.breed = breed
        self.birthday = birthday
        self.metric = metric
        self.current = current
        self.goal = goal
        self.date = date
        self.image_filename = image_filename
        self.image_url = image_url 

class Log(db.Model):
    __tablename__ = 'log'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date())
    weight = db.Column(db.Float)
    image_filename = db.Column(db.String, default=None, nullable=True)
    image_url = db.Column(db.String, default=None, nullable=True)

    foods = db.relationship('Food', back_populates='log')
    exerciselogs = db.relationship('ExerciseLog', back_populates='log')

    dog_id = db.Column(db.Integer, db.ForeignKey('dog.id'))
    dog = db.relationship('Dog', back_populates='logs')


    def __init__(self, date, weight, dog_id, image_filename=None, image_url=None):
        self.date = date
        self.weight = weight
        self.dog_id = dog_id
        self.image_filename = image_filename
        self.image_url = image_url 

class ExerciseLog(db.Model):
    __tablename__ = 'exerciselog'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exercise_type = db.Column(db.String(128))
    length = db.Column(db.Float)

    log_id = db.Column(db.Integer, db.ForeignKey('log.id'))
    log = db.relationship('Log', back_populates='exerciselogs')

class Food(db.Model):
    __tablename__ = 'food'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    food = db.Column(db.String(128))
    food_amount = db.Column(db.Integer)

    log_id = db.Column(db.Integer, db.ForeignKey('log.id'))
    log = db.relationship('Log', back_populates='foods')

    def __init__(self, food, food_amount, log_id):
        self.food = food
        self.food_amount = food_amount
        self.log_id = log_id

db.create_all()

application.config['API_MODELS'] = {
    'dog': Dog,
    'log': Log,
    'exerciselog': ExerciseLog,
    'food': Food
}

# models for which we want to create CRUD-style URL endpoints,
# and pass the routing onto our AngularJS application
application.config['CRUD_URL_MODELS'] = {
    'dog': Dog,
    'log': Log,
    'exerciselog': ExerciseLog,
    'food': Food
}