/**
 * firebase-config.example.js
 * 
 * IMPORTANTE: Este es un archivo de ejemplo.
 * 
 * Para configurar Firebase:
 * 1. Copia este archivo y renómbralo a 'firebase-config.js'
 * 2. Ve a Firebase Console: https://console.firebase.google.com
 * 3. Crea un nuevo proyecto o selecciona uno existente
 * 4. En Configuración del proyecto > Tus aplicaciones > Agregar app web
 * 5. Copia las credenciales y reemplaza los valores PLACEHOLDER abajo
 * 6. NO subas firebase-config.js al repositorio (está en .gitignore)
 */

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX" // Opcional
};

// Inicializar Firebase
let app, auth, db;

try {
  // Importar desde CDN (asegúrate de incluir los scripts en tu HTML)
  if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('✅ Firebase inicializado correctamente');
  } else {
    console.error('❌ Firebase SDK no cargado. Incluye los scripts en tu HTML:');
    console.error(`
      <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script>
      <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth-compat.js"></script>
      <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script>
    `);
  }
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDb = db;
}

// Para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { app, auth, db };
}
