from flask import request, session, g
from flask_login import login_user, logout_user, current_user
from webapp.models import User
from webapp import *
from operator import eq
import os
import json

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id==user_id).first()

@application.route('/user/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    remember = request.form.get('remember')
    user = User.query.filter(User._username==username).first()
    if user is None:
        return json.dumps({
            'loggedIn': False,
            'message': 'This user does not exist.',
            'status': 'error'  
        })
    if bcrypt.check_password_hash(user._password_hash, password):
        login_user(user, remember=remember)
        return json.dumps({
        	'loggedIn': True
        })
    else:
        return json.dumps({
            'loggedIn': False,
            'message': 'Password does not match.',
            'status': 'error'
        })
        

@application.route('/user/new', methods=['POST'])
def add_new_user():
    try:
    	username = request.form.get('username')
    	password = request.form.get('password')
    	email = request.form.get('email')
    	if username is None: 
    		return json.dumps({
    			'message': 'A username is required',
                'status': 'info'
    		})
    	elif password is None:
    		return json.dumps({
    			'message': 'A password is required',
                'status': 'info'
    		})
    	elif email is None:
    		return json.dumps({
    			'message': 'An email is required',
                'status': 'info'
    		})
        user = User.query.filter(User._email==email).first()
        if user is None:
    	   user = User(username, bcrypt.generate_password_hash(password), email)
           db.session.add(user)
           db.session.commit()
           return json.dumps({
                'message': 'Successfully registered.',
                'status': 'success'
            })
        else:
            return json.dumps({
                'message': 'A user with this email exists',
                'status': 'error'
            })
    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.route('/user/logout', methods=['POST'])
def logout():
    try:
        session.pop('logged_in', None)
        logout_user()
        return json.dumps({
            'status': 'success',
            'message': 'Logged out'
        })
    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.before_request
def before():
    if current_user.is_authenticated:
        g.user = current_user.get_id()
