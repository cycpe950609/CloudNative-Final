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
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

# config JWT
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
print(app.config)
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

class StadiumsManagerREST(Resource):
    def __init__(self, tableName : str):
        self.tableName = tableName
    
    def __get_data_type__(self):
        return request.path.split("/")[2]
    
    # @jwt_required()
    def get(self):
        with app.app_context():
            listType = request.args.get("type")
            if (listType == "name"):
                # stadium_id = int(stadium_id)
                # owner_id = get_jwt_identity()
                owner_id = 1
                try:
                    # 進行 SQL 查詢，獲取特定體育場館的開放時間
                    sql_cmd = f"""
                    select stadium_id, stadium_name
                    from stadium
                    where owner_id = {owner_id}
                    ;
                    """
                    result = db.session.execute(text(sql_cmd))
                    courtName = []
                    for idx,row in enumerate(result):
                        courtName.append({"key": row.stadium_id, "name": row.stadium_name})
                    return json.dumps(courtName)
                except Exception as e:
                    print("Error ", str(e))
                    return {"error": str(e)}, 500
            else:
                return json.dumps({"error": f"Invalid list type: {listType}"}), 400
    
    # @jwt_required()
    def post(self): # Create
        # Your code for handling POST requests
        owner_id = 1
        with app.app_context():
            data = request.get_json()
            stadium_name = data["name"]
            # return json.dumps({"message" : "test.success"})
            try:
                sql = f"""
                Insert into stadium (
                    stadium_name, owner_id
                )
                Values (
                    '{stadium_name}', {owner_id}
                );
                """
                db.session.execute(text(sql))
                db.session.commit()
                
                # Return newest table
                sql_cmd = f"""
                select stadium_id, stadium_name
                from stadium
                where owner_id = {owner_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    courtName.append({"key": row.stadium_id, "name": row.stadium_name})
                return json.dumps(courtName)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500

    # @jwt_required()
    def put(self): # Update
        with app.app_context():
            data = request.get_json()
            print(data)
            stadium_id = data['id']
            stadium_new_name = data["name"]

            # owner_id = get_jwt_identity()
            owner_id = 1
            try:
                sql = f"""
                Update stadium
                Set stadium_name = '{stadium_new_name}'
                Where stadium_id = {stadium_id}
                And owner_id = {owner_id}
                """
                db.session.execute(text(sql))
                db.session.commit()
                
                # Return newest table
                sql_cmd = f"""
                select stadium_id, stadium_name
                from stadium
                where owner_id = {owner_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    courtName.append({"key": row.stadium_id, "name": row.stadium_name})
                return json.dumps(courtName)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500
    
    # @jwt_required()
    def delete(self):
        owner_id = 1
        with app.app_context():
            data = request.get_json()
            deleted_id = data["id"]
            print("deleted_id : ",deleted_id)

            try:

                sql = f"""
                Delete from stadium
                Where stadium_id = {deleted_id}
                And owner_id = {owner_id}
                """
                db.session.execute(text(sql))
                db.session.commit()
                
                # Return newest table
                sql_cmd = f"""
                select stadium_id, stadium_name
                from stadium
                where owner_id = {owner_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    courtName.append({"key": row.stadium_id, "name": row.stadium_name})
                return json.dumps(courtName)
                
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500