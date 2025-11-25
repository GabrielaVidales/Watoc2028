document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');
    const userSection = document.getElementById('user-section');
    const loginSection = document.getElementById('login-form');
    const registerSection = document.getElementById('register-form');
    const mainContent = document.getElementById('main-content');
    const usernameDisplay = document.getElementById('username-display');
    const uploadForm = document.getElementById('uploadForm');
    const filesList = document.getElementById('files-list');
    const notificationsList = document.getElementById('notifications-list');
    const notificationBadge = document.getElementById('notification-badge');

    // Mostrar/ocultar formularios
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Registro exitoso. Por favor inicia sesión.');
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
                registerForm.reset();
            } else {
                alert(data.error || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });

    // Inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Mostrar contenido principal
                loginSection.style.display = 'none';
                userSection.style.display = 'block';
                mainContent.style.display = 'grid';
                usernameDisplay.textContent = username;
                
                // Cargar archivos y notificaciones
                loadFiles();
                loadNotifications();
            } else {
                alert(data.error || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });

    // Cerrar sesión
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET'
            });

            if (response.ok) {
                // Ocultar contenido principal y mostrar formulario de login
                userSection.style.display = 'none';
                mainContent.style.display = 'none';
                loginSection.style.display = 'block';
                filesList.innerHTML = '';
                notificationsList.innerHTML = '';
                loginForm.reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Subir archivo
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                fileInput.value = '';
                loadFiles();
                loadNotifications();
            } else {
                alert(data.error || 'Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });

    // Cargar archivos del usuario
    async function loadFiles() {
        try {
            const response = await fetch('/api/files');
            const files = await response.json();
            
            filesList.innerHTML = '';
            files.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${file.filename}</span>
                    <div class="actions">
                        <button onclick="viewFile(${file.id})">Ver</button>
                        <button class="secondary" onclick="deleteFile(${file.id})">Eliminar</button>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error al cargar archivos:', error);
        }
    }

    // Cargar archivos del usuario
    async function loadFiles() {
        try {
            const response = await fetch('/api/files');

            // Validar que la respuesta sea JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Respuesta inesperada del servidor al cargar archivos");
                return;
            }

            const files = await response.json();

            // Limpiar lista
            filesList.innerHTML = '';

            if (files.length === 0) {
                const li = document.createElement('li');
                li.textContent = "Aún no has subido archivos.";
                li.className = "notification";
                filesList.appendChild(li);
                return;
            }

            // Agregar elementos a la lista
            files.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${file.filename}</span>
                    <div class="actions">
                        <button onclick="viewFile(${file.id})">Ver</button>
                        <button class="secondary" onclick="deleteFile(${file.id})">Eliminar</button>
                    </div>
                `;
                filesList.appendChild(li);  // ← ESTA LÍNEA ERA LA QUE FALTABA
            });

        } catch (error) {
            console.error('Error al cargar archivos:', error);
        }
    }

    window.markAsRead = async function(notificationId) {
        try {
            const response = await fetch(`/api/notifications/mark-read/${notificationId}`, {
                method: 'POST'
            });

            if (response.ok) {
                loadNotifications();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Verificar estado de autenticación al cargar la página
    async function checkAuthStatus() {
        try {
            // En una aplicación real, usaríamos cookies/tokens para verificar el estado
            // Por simplicidad, asumimos que si no hay usuario mostrado, no está autenticado
        } catch (error) {
            console.error('Error verificando autenticación:', error);
        }
    }

    checkAuthStatus();
});