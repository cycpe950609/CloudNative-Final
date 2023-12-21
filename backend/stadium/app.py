from flask import Flask, Response, send_from_directory, request,make_response
from flask_cors import CORS
import os
import sys
import argparse
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_apscheduler import APScheduler
from sqlalchemy import text

from dotenv import load_dotenv
load_dotenv()


parser = argparse.ArgumentParser()
parser.add_argument("-d", "--debug", action="store_true")
args = parser.parse_args()
production_mode = 'ENV' in os.environ and os.getenv('ENV') == 'prod'


app = Flask(__name__)
CORS(app)
# config mySQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

db = SQLAlchemy(app)
# config JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

def my_task():
    with app.app_context():
        try:
            result = db.session.execute(text('SELECT 1'))
            print('Query executed: ', result)
        except Exception as e:
            print('Error during scheduled task:', e)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.add_job(id='my_task',func=my_task,trigger='interval',seconds=100)
scheduler.start()