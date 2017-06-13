from flask import request, session, g
from flask_login import login_user, logout_user, current_user
from webapp.models import User
from webapp import application, login_manager
from operator import eq
import os
import json

@login_manager.user_loader
def load_user(username):
    return User.query.filter(User._username==username).first()

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
    if eq(user._password_hash, password):
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
    	username = request.form.get('user')
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
    	   user = User(username, password, email)
           db.session.add(user)
           db.session.commit(user)
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

@application.route('/user/logout')
def logout():
    try:
        print session
        session.pop('logged_in', None)
        logout_user()
        return json.dumps({
            'result': 'success'
        })
    except Exception, e:
        return json.dumps({
            'message': str(e),
            'status': 'error'
        }), 500

@application.before_request
def before():
    g.user = current_user
