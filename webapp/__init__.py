from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

application = Flask(__name__)
bcrypt = Bcrypt(application)
login_manager = LoginManager()

application.config.from_object('webapp.settings') 
login_manager.init_app(application)
db = SQLAlchemy(application)

import app
import models
import endpoints
import helpers
