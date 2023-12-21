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

class CloseWeekday(db.Model):
    __tablename__ = 'close_weekday'
    stadium_id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.Integer, nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    is_open = db.Column(db.String(10), nullable=False)

class OpenTimeREST(Resource):
    @jwt_required()
    def get(self):
        with app.app_context():
            # 這裡假設你希望根據某個特定的體育場館ID來獲取數據
            stadium_id = request.args.get("stadium")
            print(stadium_id)

            stadium_id = int(stadium_id)
            print(stadium_id)

            if not stadium_id:
                return {"error": "No stadium_id provided"}, 400

            try:
                # 進行 SQL 查詢，獲取特定體育場館的開放時間
                sql_cmd = f"SELECT * FROM close_weekday WHERE stadium_id = {stadium_id}"
                result = db.session.execute(text(sql_cmd)).fetchall()
                timeslots = [1] * 14 * 7
                for row in result:
                    day = row.day - 1
                    hour = row.hour - 8
                    index = day * 14 + hour
                    timeslots[index] = row.is_open

                print(json.dumps(timeslots))
                # return json.dumps({"timeslots": timeslots})
                return json.dumps(timeslots)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500
        
    @jwt_required()
    def post(self):
        # Your code for handling POST requests
        with app.app_context():
            data = request.get_json()
            times = data['timeslots']
            print("Time : ", type(times[1]))
            stadiumID = data['stadium']
            for i in range(14 * 7):
                day = i // 14 + 1
                hour = i % 14 + 8
                is_open = 1 if times[i] > 0 else 0  # 假設 data[i] 是布爾值
                sql_cmd = f"""
                Update close_weekday
                Set is_open = {is_open}
                Where stadium_id = {stadiumID}
                And day = {day}
                And hour = {hour};
                """
                db.session.execute(text(sql_cmd))

                # 在所有操作完成後提交一次
            db.session.commit()

        return {'message': 'Data successfully updated'}, 200