from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
import secrets
import re

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'a0979580915@gmail.com'
app.config['MAIL_PASSWORD'] = 'bkmk yueg jxpj vqqd'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

users = {
    "user1": {"username": "user1", "password": "pass1", "email": "1@ntu.edu.tw", "verified": True, "token": "12334e545", "reset_code": ""}
}

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users.get(username)
    if user and user['password'] == password:
        if not user.get('verified'):
            return jsonify({"message": "Account is not verified. Please check your email."}), 401
        return jsonify({"message": "Login successful", "user": username})
    else:
        return jsonify({"message": "Invalid username or password"}), 401

def generate_token():
    return secrets.token_urlsafe(16)

def is_valid_password(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$'
    return re.match(pattern, password)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password') 
    email = data.get('email')

    if not password:
        return jsonify({"message": "Password is required"}), 400

    if any(user['email'] == email for user in users.values()):
        return jsonify({"message": "Email already exists"}), 400

    if username in users:
        return jsonify({"message": "Username already exists"}), 400
    
    if not is_valid_password(password):
        return jsonify({"message": "Password must be at least 7 characters long and contain uppercase, lowercase, and numbers."}), 400

    token = generate_token()
    users[username] = {"username": username, "password": password, "email": email, "verified": False, "token": token}

    verification_url = f'http://127.0.0.1:5000/verify/{token}'
    msg = Message('Email Verification', sender='a0979580915@gmail.com', recipients=[email])
    msg.body = f'Please click the following link to verify your account: {verification_url}'
    mail.send(msg)

    return jsonify({"message": "Registration successful. Please check your email to verify your account."})

@app.route('/verify/<token>')
def verify_email(token):
    for username, user_info in users.items():
        if user_info.get('token') == token:
            user_info['verified'] = True
            return 'Email verified successfully'
    return 'Invalid or expired token', 400

@app.route('/send_reset_code', methods=['POST'])
def send_reset_code():
    data = request.json
    email = data.get('email')

    user = next((user for user in users.values() if user['email'] == email), None)
    if user:
        reset_code = generate_token()[:6]
        user['reset_code'] = reset_code

        msg = Message('Your Password Reset Code', sender='a0979580915@gmail.com', recipients=[email])
        msg.body = f'Your password reset code is: {reset_code}'
        mail.send(msg)

        return jsonify({"message": "Reset code sent to your email."})
    else:
        return jsonify({"message": "Email not found."}), 404
    
@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    reset_code = data.get('reset_code')
    new_password = data.get('new_password')

    user = next((user for user in users.values() if user['email'] == email), None)
    if user and user.get('reset_code') == reset_code:
        user['password'] = new_password
        del user['reset_code']

        return jsonify({"message": "Password has been reset successfully."})
    else:
        return jsonify({"message": "Invalid reset code."}), 400
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)