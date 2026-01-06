# Scaffold Backend - Mundo Calzado

Este directorio contiene el código del servidor backend para la integración de pagos con Wompi.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Wompi

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 📋 Estructura

```
server/
├── src/
│   ├── routes/
│   │   └── payments.js       # Rutas de pagos
│   ├── controllers/
│   │   └── wompi.js          # Lógica de Wompi
│   └── index.js              # Servidor principal
├── .env.example              # Variables de entorno template
├── package.json
└── README.md
```

## 🔑 Variables de Entorno Requeridas

Ver archivo `.env.example` para la lista completa.

## 📡 Endpoints

### POST /api/payments/wompi/init
Inicializa una transacción de pago con Wompi.

### POST /api/payments/wompi/webhook
Webhook para recibir notificaciones de Wompi.

## 📖 Documentación

Ver `INSTRUCCIONES_PAGOS.md` en la raíz del proyecto para más detalles.
