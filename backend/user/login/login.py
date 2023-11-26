from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
import secrets

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
    "user1": {"username": "user1", "password": "pass1", "email": "user1@example.com", "verified": True, "token": "12334e545"}
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

    token = generate_token()
    users[username] = {"username": username, "password": password, "email": email, "verified": False, "token": token}

    verification_url = f'http://127.0.0.1:5000/verify/{token}'
    msg = Message('Email Verification', sender='your-email@yourmailserver.com', recipients=[email])
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
