from flask import Flask, Blueprint, send_from_directory, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import text
from datetime import datetime
from dotenv import load_dotenv
from threading import Thread
import os
import secrets
import re
import hashlib
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# config mySQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+mysqlconnector://root:cloudnative@cloudnative.eastasia.cloudapp.azure.com:3306/sms"
db = SQLAlchemy(app)

# config JWT
app.config['JWT_SECRET_KEY'] = 'ccm5lsvUoCfi6lrNkQJTvicHPYFLDwq_7zRU0rbX8Zg'
jwt = JWTManager(app)



class OpenTimeREST(Resource):
    def get(self):
        # dataType = self.__get_data_type__()
        listType = request.args.get("type")
        print(listType)


    def get_close_times(self):
        today = datetime.now().date()
        sql_cmd = f"""
        select cl.*, ct.court_name
        from court_close_time as cl
        join court as ct on cl.court_id = ct.court_id
        where ct.stadium_id = {self.stadium_id}
        and cl.start_date > '{today}';
        """
        query_data = db.session.execute(text(sql_cmd))
        return json.dumps(close_times)
    
    def update_close_times(self, court_id : int, start_date : str, end_date : str):
        sql_cmd = f"""
        Update court_close_time
        Set start_date = '{start_date}', end_date = '{end_date}'
        Where court_id = {court_id};
        """
        db.session.execute(text(sql_cmd))
        db.session.commit()
        return 


class AnnounceREST(Resource):
    def __init__(self, stadium_id : int):
        self.stadium_id = stadium_id

    def get_annouce(self):
        today = datetime.now().date()
        sql_cmd = f"""
        select cl.*, ct.court_name
        from court_close_time as cl
        join court as ct on cl.court_id = ct.court_id
        where ct.stadium_id = {self.stadium_id}
        and cl.start_date > '{today}';
        """
        query_data = db.session.execute(text(sql_cmd))
        return json.dumps(close_times)
    
    def update_close_times(self, announcement_id : int, start_date : str, end_date : str, title : str, content : str):
        sql_cmd = f"""
        Update announcement
        Set start_date = '{start_date}', end_date = '{end_date}', title = '{title}', content = '{content}'
        Where announcement_id = {announcement_id};
        """
        db.session.execute(text(sql_cmd))
        db.session.commit()
        return json.dumps(close_times)
