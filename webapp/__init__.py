from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_heroku import Heroku

application = Flask(__name__)
heroku = Heroku(application)

application.config.from_object('webapp.settings') 

db = SQLAlchemy(application)

import app
import models
import endpoints