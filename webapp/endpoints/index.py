from flask import render_template
from webapp import application
  
@application.route('/')
def index():
    return render_template('index.html')
