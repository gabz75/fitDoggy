from flask import Flask
from pymongo import MongoClient

import os
import json

application = Flask(__name__)

application.config.from_object('webapp.settings')
application.url_map.strict_slashes = False

client = MongoClient('localhost:27017')
db = client.MachineData

import webapp.app
