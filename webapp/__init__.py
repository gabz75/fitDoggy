from flask import Flask
from flask_sqlalchemy import SQLAlchemy

application = Flask(__name__, instance_relative_config=True)

application.config.from_object('webapp.settings') 
application.url_map.strict_slashes = False

db = SQLAlchemy(application)

import webapp.app
import webapp.models
import webapp.exercise
import webapp.food
import webapp.log
import webapp.dog
