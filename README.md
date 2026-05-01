# BikeTracking

Sistema integrado de seguimiento y gestión de motocicletas personales con autenticación de usuarios y registro de mantenimientos.

---

## Módulos

### Módulo Motocicletas ✅ Completado

**Estado:** Completamente funcional con autenticación.

Permite a cada usuario:
- 📝 Registrar su motocicleta con datos básicos (placa, marca, modelo, año, cilindraje, etc.)
- 🔍 Consultar el estado actual del vehículo
- 🔧 Llevar un historial detallado de mantenimientos y servicios
- 👤 Acceso seguro con autenticación por usuario/contraseña

**Ubicación:** `modulo-motocicletas/`

---

## Avances (30 de abril de 2026)

### Sincronización de repositorio
- ✅ Conectado el remoto upstream a `ThomasJuti/BikeTracking`
- ✅ Actualizado `main` local con cambios del equipo (66 archivos, +21,762 líneas)
- ✅ Publicados cambios a `origin/main`

### Sistema de autenticación
- ✅ **Backend:** Endpoints de registro, login y logout
- ✅ **Seguridad:** Contraseñas hasheadas con scrypt + salt aleatorio
- ✅ **Tokens:** Sistema de sesiones con tokens aleatorios de 32 bytes
- ✅ **Protección de rutas:** Todos los endpoints de la API requieren autenticación (401 si no hay token válido)

### Frontend
- ✅ **Nueva página de login:** `login.html` y `login.js`
  - Dos tabs: "Iniciar sesión" y "Registrarse"
  - Validación de campos (usuario mín. 3 caracteres, contraseña mín. 6 caracteres)
  - Mensajes de error y éxito contextualizados

- ✅ **Guards de autenticación:** Redireccionan a `/login.html` si no hay sesión
  - Implementados en `app.js`, `home.js`, `maintenance.js`

- ✅ **Botones de logout:** Agregados en todas las vistas protegidas
  - Disponibles en `home.html`, `index.html`, `maintenance.html`

- ✅ **Headers con autorización:** Todos los fetch incluyen `Authorization: Bearer <token>`

### Validación del flujo completo
- ✅ Endpoint sin token devuelve 401
- ✅ Registro de nuevo usuario correcto
- ✅ Login devuelve token válido
- ✅ API responde correctamente con token en header

---

## Estructura de carpetas

```
BikeTracking/
├── modulo-motocicletas/
│   ├── backend/
│   │   ├── server.js              # API REST con Express
│   │   ├── package.json
│   │   └── data/
│   │       ├── motos.json         # Almacenamiento de motos
│   │       ├── mantenimientos.json
│   │       └── users.json         # Usuarios (contraseñas hasheadas)
│   ├── frontend/
│   │   ├── login.html             # Pantalla de acceso
│   │   ├── login.js
│   │   ├── home.html              # Dashboard
│   │   ├── home.js
│   │   ├── index.html             # Ficha de la moto
│   │   ├── app.js
│   │   ├── maintenance.html       # Mantenimiento
│   │   ├── maintenance.js
│   │   └── styles.css
│   └── README.md                  # Documentación detallada del módulo
├── Backend/                       # Backend principal (NestJS)
├── Frontend/                      # Frontend principal (Angular)
└── README.md                      # Este archivo
```

---

## Cómo ejecutar el módulo motocicletas

```bash
cd modulo-motocicletas/backend
npm install
npm run start
```

Accede en **http://localhost:3000**

---

## API - Endpoints principales

### Autenticación
- `POST /api/auth/register` — Registrar nuevo usuario
- `POST /api/auth/login` — Iniciar sesión, devuelve token
- `POST /api/auth/logout` — Cerrar sesión

### Motocicletas (requieren token)
- `GET /api/motos` — Listar motos del usuario
- `POST /api/motos` — Registrar nueva moto
- `PUT /api/motos/:id` — Actualizar datos de la moto
- `DELETE /api/motos/:id` — Eliminar moto

### Mantenimientos (requieren token)
- `GET /api/mantenimientos` — Listar mantenimientos
- `POST /api/mantenimientos` — Registrar nuevo mantenimiento

Consulta `modulo-motocicletas/README.md` para documentación completa de endpoints, campos, ejemplos y detalles técnicos de seguridad.

---

## Commits relevantes

| Hash | Rama | Descripción |
|------|------|-------------|
| `3d96047` | modulo-motocicletas | Agrega autenticacion y documentacion al modulo motocicletas |
| `70183e2` | modulo-motocicletas | Estructura correcta del módulo motocicletas |
| `6c481b6` | main | README (sincronizado con upstream) |

---

## Notas

- El módulo motocicletas es **independiente** y puede ejecutarse por separado.
- La autenticación está **completamente implementada** en backend y frontend.
- Los datos persisten en archivos JSON (`data/`); se pueden migrar a base de datos en el futuro.
- Las sesiones se guardan **en memoria**; al reiniciar el servidor, los tokens anteriores se invalidan (los usuarios siguen existiendo).