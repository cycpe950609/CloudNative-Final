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

class Account(db.Model):
    __tablename__ = 'account'
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(30), nullable=False)
    token = db.Column(db.String(32), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    height = db.Column(db.Integer, nullable=False)
    user_type = db.Column(db.String(10), default='User')
    verified = db.Column(db.String(10), default='False')
    status = db.Column(db.String(10), default='Normal')
    reset_code = db.Column(db.String(10), nullable=True)

class AnnounceREST(Resource):
    @jwt_required()
    def get(self):
        # 需要user_id，目前是查詢所有公告
        with app.app_context():
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
                select *
                from announcement
                where start_date > '{today}'
                Order by announcement_id;
                """
                result = db.session.execute(text(sql_cmd))
                announce = []
                for row in result:
                    key = str(row.announcement_id)
                    startDate = str(row.start_date)
                    endDate = str(row.end_date)
                    title = str(row.title)
                    content = str(row.content)
                    announce.append({"key": key, "startDate": startDate, "endDate": endDate, "title": title, "content": content})
                print(announce)
                return json.dumps(announce)
            except Exception as e:
                print("Error ", str(e))
                return {"error": str(e)}, 500

    @jwt_required()
    def post(self):
        # 這裡user_id暫時設為1
        with app.app_context():
            data = request.get_json()
            stadium_id = data['stadium']
            new = data["announce"]
            print(new)
            start_date = new["startDate"]
            end_date = new["endDate"]
            title = new["title"]
            content = new["content"]

            sql1 = f"""
            Insert into announcement (
                start_date, end_date, title, content, writer_id
            )
            Values (
                '{start_date}', '{end_date}', '{title}', '{content}', 1
            );
            """
            db.session.execute(text(sql1))

            db.session.commit()

            today = datetime.now().date()
            sql2 = f"""
            select *
            from announcement
            where start_date > '{today}'
            Order by announcement_id;
            """
            result = db.session.execute(text(sql2))
            announce = []
            for row in result:
                key = str(row.announcement_id)
                startDate = str(row.start_date)
                endDate = str(row.end_date)
                title = str(row.title)
                content = str(row.content)
                announce.append({"key": key, "startDate": startDate, "endDate": endDate, "title": title, "content": content})
        return json.dumps(announce)
    
    @jwt_required()
    def put(self): # Update
        # 這裡user_id暫時設為1
        with app.app_context():
            data = request.get_json()
            stadium_id = data['stadium']
            new = data["announce"]
            print(new)
            announcement_id = int(new["key"])
            start_date = new["startDate"]
            end_date = new["endDate"]
            title = new["title"]
            content = new["content"]

            sql_cmd = f"""
            Update announcement
            Set start_date = '{start_date}', end_date = '{end_date}',
            title = '{title}', content = '{content}', writer_id = 1
            Where announcement_id = {announcement_id};
            """
            db.session.execute(text(sql_cmd))

            db.session.commit()

        return {'message': 'Data successfully updated'}, 200
    
    @jwt_required()
    def delete(self):
        with app.app_context():
            data = request.get_json()
            announcement_id = data["deleted"]
            print(announcement_id)

            sql_cmd = f"""
            Delete from announcement
            Where announcement_id = {announcement_id};
            """

            db.session.execute(text(sql_cmd))

            db.session.commit()

        return {'message': 'Data successfully updated'}, 200