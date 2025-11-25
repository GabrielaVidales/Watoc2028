import os, json, bson
from flask import Blueprint, render_template, request, make_response, redirect, url_for, jsonify, flash, send_from_directory
from flask_login import login_user, login_required, logout_user, current_user
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename
from .extensions import login_manager, mail, get_mongo_client, get_mongo_db
from .models import *
from mongoengine import ValidationError, FieldDoesNotExist

bp = Blueprint(
    name='main',
    import_name= __name__,
    static_folder='static',
    template_folder='templates'
)


@login_manager.user_loader
def load_user(user_id):
    return user_id
    # return User.query.get(int(user_id))


# Ruta para servir el archivo index.html
@bp.route('/')
def serve_index():
    return render_template('home.html')


# Crear un registro de request
@bp.route('/api/contact', methods=['POST'])
def api_contact_request():
    try:
        name = request.form.get('firstName', None)
        last_name = request.form.get('lastName', None)
        email = request.form.get('email', None)
        request_type = request.form.get('requestType', None)
        inquiry = request.form.get('inquiry', None)

        contact_request = ContactRequest(name, last_name, email, request_type, inquiry)
        contact_request.validate()
        contact_request.save()       

        """TODO: Aqui se podría mandar un mail al correo"""

        print(contact_request)
        return make_response(bson.json_util.dumps(contact_request.to_mongo()), 200)
    except FieldDoesNotExist as e:
        print(f'[FieldDoesNotExist]: {e}')
        return make_response({ 'error de campo': 'No se creó correctamente el recurso'}, 500)
    except ValidationError as e:
        print(f'[ValidationError]: {e.message}')
        for field, error in e.errors.items(): print(f'[{field}]: {error.message}')
        return make_response({ 'error': 'No se creó correctamente el recurso'}, 500)
    except Exception as e:
        print(f'[Exception]: {e}')
        return make_response({ 'error genérico': 'No se creó correctamente el recurso'}, 500)


# Crear un registro de assistant
@bp.route('/api/assistant', methods=['POST'])
def api_assistant():
    try:
        visaData = VisaStatus(
            required=request.form.get('requiresVisa', None), 
            invitation_letter=request.form.get('invitation', None)
        )
        transactionData = Transaction(
            has=request.form.get('paymentStatus', None), 
            token=request.form.get('tokenId', None)
        )
        assistant = Assistant(
            first_name=request.form.get('firstName', None),
            last_name=request.form.get('lastName', None),
            email=request.form.get('email', None),
            category=request.form.get('category', None),
            tier=request.form.get('tier', None),
            cena_congreso=request.form.get('conferenceDinner', None),
            visa=visaData,
            transaccion=transactionData
        )
        assistant.validate()
        assistant.save()
        return make_response(bson.json_util.dumps(assistant.to_mongo()), 200)
    except ValidationError as e:
        for field, error in e.errors.items(): print(f'[{field}]: {error.message}')
    except Exception as e:
        print(f'[Exception]: {e}')
    
    return make_response({ 'error': 'No se creó correctamente el recurso'}, 500)




# Ruta para servir archivos estáticos (CSS, JS)
# @bp.route('/<path:filename>')
# def serve_static(filename):
#     # Lista de archivos permitidos
#     allowed_files = ['style.css', 'script.js']
#     if filename in allowed_files:
#         return send_from_directory('.', filename)
#     return "Not found", 404

# # API Routes (mantenemos las originales)
# @bp.route('/api/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     username = data.get('username')
#     email = data.get('email')
#     password = data.get('password')
    
#     if User.query.filter_by(username=username).first():
#         return jsonify({'error': 'Username already exists'}), 400
#     if User.query.filter_by(email=email).first():
#         return jsonify({'error': 'Email already exists'}), 400
    
#     user = User(username=username, email=email, password=password)
#     db.session.add(user)
#     db.session.commit()
    
#     # Enviar email de bienvenida
#     msg = Message('Bienvenido a nuestro sitio', recipients=[email])
#     msg.body = f'Hola {username}, gracias por registrarte en nuestro sitio!'
    
#     return jsonify({'message': 'User created successfully'}), 201

# @bp.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     user = User.query.filter_by(username=data.get('username')).first()
    
#     if user and user.password == data.get('password'):
#         login_user(user)
#         return jsonify({'message': 'Logged in successfully'}), 200
#     return jsonify({'error': 'Invalid credentials'}), 401

# @bp.route('/api/logout')
# @login_required
# def logout():
#     logout_user()
#     return jsonify({'message': 'Logged out successfully'}), 200

# @bp.route('/api/upload', methods=['POST'])
# @login_required
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
    
#     if file:
#         filename = secure_filename(file.filename)
#         filepath = os.path.join(bp.config['UPLOAD_FOLDER'], filename)
#         file.save(filepath)
        
#         new_file = File(filename=filename, path=filepath, user_id=current_user.id)
#         db.session.add(new_file)
#         db.session.commit()
        
#         notification = Notification(
#             user_id=current_user.id,
#             message=f'Has subido el archivo {filename} correctamente'
#         )
#         db.session.add(notification)
#         db.session.commit()
        
#         return jsonify({'message': 'File uploaded successfully'}), 201

# @bp.route('/api/files')
# @login_required
# def get_files():
#     files = File.query.filter_by(user_id=current_user.id).all()
#     return jsonify([{'id': f.id, 'filename': f.filename} for f in files]), 200

# @bp.route('/api/notifications')
# @login_required
# def get_notifications():
#     notifications = Notification.query.filter_by(user_id=current_user.id, is_read=False).all()
#     return jsonify([{'id': n.id, 'message': n.message} for n in notifications]), 200

# @bp.route('/api/notifications/mark-read/<int:notification_id>', methods=['POST'])
# @login_required
# def mark_notification_read(notification_id):
#     notification = Notification.query.get_or_404(notification_id)
#     if notification.user_id != current_user.id:
#         return jsonify({'error': 'Unauthorized'}), 403
    
#     notification.is_read = True
#     db.session.commit()
#     return jsonify({'message': 'Notification marked as read'}), 200

# @bp.route('/api/file/<int:file_id>/download')
# @login_required
# def download_file(file_id):
#     file = File.query.get_or_404(file_id)

#     if file.user_id != current_user.id:
#         return jsonify({'error': 'Unauthorized'}), 403

#     directory = os.path.dirname(file.path)
#     filename = os.path.basename(file.path)

#     return send_from_directory(directory, filename, as_attachment=False)

# @bp.route('/api/file/<int:file_id>/delete', methods=['DELETE'])
# @login_required
# def delete_file(file_id):
#     file = File.query.get_or_404(file_id)

#     if file.user_id != current_user.id:
#         return jsonify({'error': 'Unauthorized'}), 403

#     # Borrar archivo físico
#     if os.path.exists(file.path):
#         os.remove(file.path)

#     # Borrar de la base de datos
#     db.session.delete(file)
#     db.session.commit()

#     return jsonify({'message': 'File deleted successfully'}), 200
