from flask import Flask, request, jsonify, render_template
from flask_mail import Mail, Message
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from threading import Thread
import os
import secrets
import re

app = Flask(__name__)
CORS(app)

load_dotenv()

# config mail server
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# config mySQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

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

def generate_token():
    return secrets.token_urlsafe(16)

def is_valid_password(password):
    pattern = r'^(?=.*[a-z])(?=.*\d)[a-z\d]{7,}$'
    return re.match(pattern, password)

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'
    return re.match(pattern, email)

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_verification_email(email, token):
    verification_url = f'http://cloudnative.eastasia.cloudapp.azure.com/login/verify/{token}'
    msg = Message('Email Verification', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Please click the following link to verify your account: {verification_url}'
    Thread(target=send_async_email, args=(app, msg)).start()

def send_resetcode_email(email, reset_code):
    msg = Message('Your Password Reset Code', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Your password reset code is: {reset_code}'
    Thread(target=send_async_email, args=(app, msg)).start()

@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

@app.route('/login/forgot_password', methods=['GET'])
def forgot_password_page():
    return render_template('forgot_password.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = Account.query.filter_by(user_name=username, password=password).first()
    if user:
        if user.verified == 'False':
            return jsonify({"message": "Account is not verified. Please check your email."}), 401
        return jsonify({"message": "Login successful", "user": username})
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/login/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password') 
    email = data.get('email')

    if not password:
        return jsonify({"message": "Password is required"}), 400

    existing_email = Account.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({"message": "Email already exists"}), 400

    existing_username = Account.query.filter_by(user_name=username).first()
    if existing_username:
        return jsonify({"message": "Username already exists"}), 400
    
    if not is_valid_password(password):
        return jsonify({"message": "Password must be at least 7 characters long and contains lowercase letter, number"}), 400

    if not is_valid_email(email):
        return jsonify({"message": "Invalid email"}), 400

    token = generate_token()
    
    new_user = Account(user_name=username, password=password, email=email, token=token, gender='Male', height=200, user_type='Admin', verified='False', status='Normal')
    db.session.add(new_user)
    db.session.commit()

    send_verification_email(email, token)

    return jsonify({"message": "Registration successful. Please check your email to verify your account."})

@app.route('/login/verify/<token>')
def verify_email(token):
    user = Account.query.filter_by(token=token).first()
    if user:
        user.verified = 'True'
        db.session.commit()
        return 'Email verified successfully'
    return 'Invalid token', 400

@app.route('/login/send_reset_code', methods=['POST'])
def send_reset_code():
    data = request.json
    email = data.get('email')

    user = Account.query.filter_by(email=email).first()
    if user:
        reset_code = generate_token()[:6]
        user.reset_code = reset_code
        db.session.commit()
        
        send_resetcode_email(email, reset_code)

        return jsonify({"message": "Reset code sent to your email."})
    else:
        return jsonify({"message": "Email not found."}), 404
    
@app.route('/login/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    reset_code = data.get('reset_code')
    new_password = data.get('new_password')

    user = Account.query.filter_by(email=email, reset_code=reset_code).first()
    if user:
        user.password = new_password
        user.reset_code = None
        db.session.commit()

        return jsonify({"message": "Password has been reset successfully."})
    else:
        return jsonify({"message": "Invalid reset code."}), 400
    
if __name__ == '__main__':
    app.run(debug=True, port=4999)