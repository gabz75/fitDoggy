from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

application = Flask(__name__)

login_manager = LoginManager()

application.config.from_object('webapp.settings') 
login_manager.init_app(application)
db = SQLAlchemy(application)

import app
import models
import endpoints
import helpers
