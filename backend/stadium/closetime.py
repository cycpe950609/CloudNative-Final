from flask import Flask, Blueprint, send_from_directory, request
from flask_restful import Resource
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import text
from datetime import datetime
from dotenv import load_dotenv
from threading import Thread
from flask_apscheduler import APScheduler
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


class CloseTimeREST(Resource):
    def get(self):
        with app.app_context():
            listType = request.args.get("type")
            if(listType == "time"):
                # 這裡假設你希望根據某個特定的體育場館ID來獲取數據
                stadium_id = request.args.get("stadium")
                print(stadium_id)

                stadium_id = int(stadium_id)
                print(stadium_id)

                if not stadium_id:
                    return {"error": "No stadium_id provided"}, 400

                try:
                    # 進行 SQL 查詢，獲取特定體育場館的開放時間
                    today = datetime.now().date()
                    sql_cmd = f"""
                    select cl.*, ct.court_name
                    from court_close_date as cl
                    join court as ct on cl.court_id = ct.court_id
                    where ct.stadium_id = {stadium_id}
                    and cl.start_date > '{today}';
                    """
                    result = db.session.execute(text(sql_cmd))
                    closetime = []
                    ct = 1
                    for row in result:
                        key = str(ct)
                        courtName = str(row.court_name)
                        startDate = str(row.start_date)
                        endDate = str(row.end_date)
                        closetime.append({"key": key, "courtName": courtName, "startDate": startDate, "endDate": endDate})
                        ct += 1
                    print(closetime)
                    return json.dumps(closetime)
                except Exception as e:
                    print("Error ", str(e))
                    return {"error": str(e)}, 500
            elif (listType == "name"):
                stadium_id = request.args.get("stadium")
                print(stadium_id)

                stadium_id = int(stadium_id)
                if not stadium_id:
                    return {"error": "No stadium_id provided"}, 400

                try:
                    # 進行 SQL 查詢，獲取特定體育場館的開放時間
                    sql_cmd = f"""
                    select court_name
                    from court
                    where stadium_id = {stadium_id};
                    """
                    result = db.session.execute(text(sql_cmd))
                    courtName = []
                    for row in result:
                        courtName.append(row.court_name)
                    return json.dumps(courtName)
                except Exception as e:
                    print("Error ", str(e))
                    return {"error": str(e)}, 500
            else:
                return json.dumps({"error": f"Invalid list type: {listType}"}), 400
        
    def post(self):
        # Your code for handling POST requests
        with app.app_context():
            data = request.get_json()
            stadium_id = data['stadium']
            newclose = data["closetime"]
            print(newclose)
            court_name = newclose["courtName"]
            start_date = newclose["startDate"]
            end_date = newclose["endDate"]

            sql1 = f"""
                    select court_id
                    from court
                    where court_name = '{court_name}'
                    And stadium_id = {stadium_id};
                    """
            result = db.session.execute(text(sql1))
            for row in result:
                court_id = row.court_id

            sql2 = f"""
            Insert into court_close_date (
                court_id, start_date, end_date
            )
            Values (
                {court_id}, '{start_date}', '{end_date}'
            );
            """
            db.session.execute(text(sql2))

            db.session.commit()

       
        return {'message': 'Data successfully updated'}, 200
    def put(self): # Update
        with app.app_context():
            data = request.get_json()
            stadium_id = data['stadium']
            newclose = data["closetime"]
            old = data["old"]
            print(newclose)
            old_start_date = old["startDate"]
            old_end_date = old["endDate"]
            court_name = newclose["courtName"]
            start_date = newclose["startDate"]
            end_date = newclose["endDate"]

            sql1 = f"""
                    select court_id
                    from court
                    where court_name = '{court_name}'
                    And stadium_id = {stadium_id};
                    """
            result = db.session.execute(text(sql1))
            for row in result:
                court_id = row.court_id

            sql2 = f"""
            Update court_close_date
            Set start_date = '{start_date}', end_date = '{end_date}'
            Where court_id = '{court_id}'
            """
            db.session.execute(text(sql2))

            db.session.commit()

       
        return {'message': 'Data successfully updated'}, 200
    
    def delete(self):
        with app.app_context():
            data = request.get_json()
            deleted = data["deleted"]
            print(deleted)
            court_name = deleted["courtName"]
            start_date = deleted["startDate"]
            end_date = deleted["endDate"]

            sql1 = f"""
                    select court_id
                    from court
                    where court_name = '{court_name}';
                    """
            result = db.session.execute(text(sql1))
            for row in result:
                court_id = row.court_id

            sql2 = f"""
            Delete from court_close_date
            Where court_id = court_id
            And start_date = '{start_date}'
            And end_date = '{end_date}';
            """
            db.session.execute(text(sql2))

            db.session.commit()

       
        return {'message': 'Data successfully updated'}, 200