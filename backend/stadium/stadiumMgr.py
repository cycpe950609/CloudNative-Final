from flask import Flask, Blueprint, send_from_directory, request
from flask_restful import Resource
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
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
from app import app, db, jwt

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
    @jwt_required()
    def get(self):
        with app.app_context():
            listType = request.args.get("type")
            if (listType == "name"):
                # stadium_id = int(stadium_id)
                # owner_id = get_jwt_identity()
                # print("valid : ",verify_jwt_in_request())
                verify_jwt_in_request()
                owner_id = get_jwt_identity()
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
    
    @jwt_required()
    def post(self): # Create
        # Your code for handling POST requests
        verify_jwt_in_request()
        owner_id = get_jwt_identity()
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

                # Get stadium id
                sql_get_id = f"""
                select stadium_id
                from stadium
                where owner_id = {owner_id}
                And stadium_name = '{stadium_name}'
                ;
                """
                result = db.session.execute(text(sql_get_id))
                stadium_id = -1
                for idx,row in enumerate(result):
                    stadium_id = row.stadium_id

                print("Created ID is : ", stadium_id)

                # Create Table of open time
                for i in range(14 * 7):
                    day = i // 14 + 1
                    hour = i % 14 + 8
                    is_open = 1
                    sql_new_entry = f"""
                    Insert into close_weekday (
                        stadium_id, hour, day, is_open
                    )
                    Values (
                        {stadium_id}, {hour}, {day}, 1
                    );
                    """
                    # sql_cmd = f"""
                    # Update close_weekday
                    # Set is_open = {is_open}
                    # Where stadium_id = {stadiumID}
                    # And day = {day}
                    # And hour = {hour};
                    # """
                    db.session.execute(text(sql_new_entry)) 

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

    @jwt_required()
    def put(self): # Update
        with app.app_context():
            data = request.get_json()
            print(data)
            stadium_id = data['id']
            stadium_new_name = data["name"]

            verify_jwt_in_request()
            owner_id = get_jwt_identity()
            # owner_id = get_jwt_identity()
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
    
    @jwt_required()
    def delete(self):
        verify_jwt_in_request()
        owner_id = get_jwt_identity()
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

                sql_del_open_time = f"""
                Delete from close_weekday
                Where stadium_id = {deleted_id}
                And owner_id = {owner_id}
                """
                db.session.execute(text(sql_del_open_time))

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