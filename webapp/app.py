from webapp import application, db

import os
def runserver():
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port, debug=True)

def seed():
	if Exercise.query.all().count() == 0:
		run = Exercise('Run', '4 mph')
		walk = Exercise('Walk', '2 mph')
		db.session.add(run)
		db.session.add(walk)
		db.session.commit()

def seed():
	if Exercise.query.all().count() == 0:
		run = Exercise('Run', '4 mph')
		walk = Exercise('Walk', '2 mph')
		db.session.add(run)
		db.session.add(walk)
		db.session.commit()

if __name__ == '__main__':
    runserver()
    from models import Exercise
    seed()
