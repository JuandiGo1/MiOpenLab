# 📘 MiOpenLab

**MiOpenLab** es una aplicación inspirada en la iniciativa **OpenLab** de la Universidad del Norte. Su propósito es permitir que estudiantes y docentes suban, compartan y reutilicen proyectos académicos funcionales, promoviendo así el aprendizaje colaborativo y la innovación práctica en el entorno universitario.

---

## 🚀 Funcionalidades

- ✅ **Autenticación con Firebase** (registro, login tradicional y con Google).
- 🌐 **Exploración libre de proyectos** sin necesidad de iniciar sesión.
- 👤 **Perfiles de usuario personalizados** con rutas como `/profile`, `/profile/edit`, etc.
- ➕ **Creación y edición de proyectos** con soporte para contenido en **Markdown**.
- 🗑️ **Eliminación de proyectos** (solo por su autor).
- ❤️ **Likes** a proyectos (con lógica para evitar múltiples likes por el mismo usuario).
- 👥 **Sistema de seguidores** entre usuarios.
- 🔔 **Notificaciones** cuando alguien da like a tu proyecto o te sigue.
- 📊 **Sección de proyectos destacados**, por número de likes o popularidad.
- 🔎 **Buscador en tiempo real** de proyectos.
- 🌙 **Modo oscuro** integrado.
- ⚡ **Interfaz reactiva e informativa**, con loaders y skeletons para mejorar la experiencia de usuario mientras se cargan datos.

---

## 🧰 Tecnologías

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)

---

## 📷 Capturas

---
## 🛠️ Instalación y ejecución en local

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/JuandiGo1/MiOpenLab.git
   cd MiOpenLab
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura Firebase:**

   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
   - Habilita **Authentication** (Email/Password y Google).
   - Crea una base de datos en **Cloud Firestore** y habilitar indices cuando solicite.
   - Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales:

     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Ejecuta la aplicación:**

   ```bash
   npm run dev
   ```

   Accede desde [http://localhost:5173](http://localhost:5173)

---
