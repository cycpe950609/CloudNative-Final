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
from app import app, db, jwt

class CourtsManagerREST(Resource):
    @jwt_required()
    def get(self):
        with app.app_context():
            # stadium_id = int(stadium_id)
            # owner_id = get_jwt_identity()
            stadium_id = request.args.get("stadium")
            try:
                # 進行 SQL 查詢
                sql_cmd = f"""
                select court_id, court_name, max_capacity
                from court
                where stadium_id = {stadium_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    # print(idx,row)
                    courtName.append({"key": row.court_id, "name": row.court_name, "capacity": row.max_capacity})
                return json.dumps(courtName)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500
    @jwt_required()
    def post(self): # Create
        # Your code for handling POST requests
        verify_jwt_in_request()
        owner_id = get_jwt_identity()
        with app.app_context():
            data = request.get_json()
            court_name = data["name"]
            stadium_id = int(data["stadium"])
            court_max_capacity = data["max_capacity"]
            print(stadium_id,court_max_capacity)
            # return json.dumps({"message" : "test.success"})
            try:
                sql = f"""
                Insert into court (
                    court_name, stadium_id, max_capacity
                )
                Values (
                    '{court_name}', {stadium_id}, {court_max_capacity}
                );
                """
                db.session.execute(text(sql))
                db.session.commit()
                
                # Return newest table
                sql_cmd = f"""
                select court_id, court_name, max_capacity
                from court
                where stadium_id = {stadium_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    courtName.append({"key": row.court_id, "name": row.court_name, "capacity": row.max_capacity})
                return json.dumps(courtName)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500

    @jwt_required()
    def put(self): # Update
        with app.app_context():
            data = request.get_json()
            print(data)
            stadium_id = data['stadium']
            court_id = data["id"]
            court_new_name = data["name"]
            court_max_capacity = data["max_capacity"]
            try:
                sql = f"""
                Update court
                Set court_name = '{court_new_name}', max_capacity = {court_max_capacity}
                Where stadium_id = {stadium_id}
                And court_id = {court_id}
                """
                db.session.execute(text(sql))
                db.session.commit()
                
                # Return newest table
                sql_cmd = f"""
                select court_id, court_name, max_capacity
                from court
                where stadium_id = {stadium_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    courtName.append({"key": row.court_id, "name": row.court_name, "capacity": row.max_capacity})
                return json.dumps(courtName)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500
    
    @jwt_required()
    def delete(self):
        with app.app_context():
            data = request.get_json()
            deleted_id = data["id"]
            stadium_id = data['stadium']
            print("stadium_id", stadium_id, "deleted_id : ",deleted_id)

            try:

                sql = f"""
                Delete from court
                Where stadium_id = {stadium_id}
                And court_id = {deleted_id}
                """
                db.session.execute(text(sql))
                db.session.commit()
                
                # Return newest table
                sql_cmd = f"""
                select court_id, court_name, max_capacity
                from court
                where stadium_id = {stadium_id}
                ;
                """
                result = db.session.execute(text(sql_cmd))
                courtName = []
                for idx,row in enumerate(result):
                    # print(idx,row)
                    courtName.append({"key": row.court_id, "name": row.court_name, "capacity": row.max_capacity})
                return json.dumps(courtName)
                
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500