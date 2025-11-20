import os
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu-clave-secreta-aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'tu-email@example.com'
app.config['MAIL_PASSWORD'] = 'tu-contraseña'
app.config['MAIL_DEFAULT_SENDER'] = 'tu-email@example.com'

db = SQLAlchemy(app)
login_manager = LoginManager(app)
mail = Mail(app)

# Configuración para notificaciones
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    files = db.relationship('File', backref='owner', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    path = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Ruta para servir el archivo index.html
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Ruta para servir archivos estáticos (CSS, JS)
@app.route('/<path:filename>')
def serve_static(filename):
    # Lista de archivos permitidos
    allowed_files = ['style.css', 'script.js']
    if filename in allowed_files:
        return send_from_directory('.', filename)
    return "Not found", 404

# API Routes (mantenemos las originales)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    
    # Enviar email de bienvenida
    msg = Message('Bienvenido a nuestro sitio', recipients=[email])
    msg.body = f'Hola {username}, gracias por registrarte en nuestro sitio!'
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and user.password == data.get('password'):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/upload', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        new_file = File(filename=filename, path=filepath, user_id=current_user.id)
        db.session.add(new_file)
        db.session.commit()
        
        notification = Notification(
            user_id=current_user.id,
            message=f'Has subido el archivo {filename} correctamente'
        )
        db.session.add(notification)
        db.session.commit()
        
        return jsonify({'message': 'File uploaded successfully'}), 201

@app.route('/api/files')
@login_required
def get_files():
    files = File.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': f.id, 'filename': f.filename} for f in files]), 200

@app.route('/api/notifications')
@login_required
def get_notifications():
    notifications = Notification.query.filter_by(user_id=current_user.id, is_read=False).all()
    return jsonify([{'id': n.id, 'message': n.message} for n in notifications]), 200

@app.route('/api/notifications/mark-read/<int:notification_id>', methods=['POST'])
@login_required
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    if notification.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    notification.is_read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'}), 200

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True)

@app.route('/api/file/<int:file_id>/download')
@login_required
def download_file(file_id):
    file = File.query.get_or_404(file_id)

    if file.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    directory = os.path.dirname(file.path)
    filename = os.path.basename(file.path)

    return send_from_directory(directory, filename, as_attachment=False)

@app.route('/api/file/<int:file_id>/delete', methods=['DELETE'])
@login_required
def delete_file(file_id):
    file = File.query.get_or_404(file_id)

    if file.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    # Borrar archivo físico
    if os.path.exists(file.path):
        os.remove(file.path)

    # Borrar de la base de datos
    db.session.delete(file)
    db.session.commit()

    return jsonify({'message': 'File deleted successfully'}), 200
