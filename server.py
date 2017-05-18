import os
from webapp import application


def runserver():
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0')

if __name__ == '__main__':
    runserver()
