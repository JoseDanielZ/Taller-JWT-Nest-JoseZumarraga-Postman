# 🔐 Taller JWT - Autenticación en NestJS

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)

## 📋 Descripción

Este proyecto implementa un sistema completo de autenticación JWT (JSON Web Tokens) en NestJS. Incluye registro de usuarios con contraseñas hasheadas, login que genera tokens JWT, protección de rutas usando Guards, y acceso a la información del usuario autenticado.

**Repositorio:** [GitHub - Taller JWT Nest JoseZumarraga](https://github.com/JoseDanielZ/Taller-JWT-Nest-JoseZumarraga-Postman)

## 🚀 Características

- ✅ **Registro de usuarios** con validación de datos
- ✅ **Login con JWT** - Generación de tokens de acceso
- ✅ **Protección de rutas** usando Guards de autenticación
- ✅ **Hashing de contraseñas** con bcrypt
- ✅ **Validación de DTOs** con class-validator
- ✅ **Módulos separados** para auth y users
- ✅ **Base de datos en memoria** (array) para simplicidad
- ✅ **Documentación completa** del código

## 🛠️ Tecnologías Utilizadas

- **Framework:** [NestJS](https://nestjs.com/) - Framework Node.js progresivo
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Autenticación:** [Passport.js](http://www.passportjs.org/) con estrategia JWT
- **JWT:** [@nestjs/jwt](https://docs.nestjs.com/security/authentication#jwt-functionality)
- **Hashing:** [bcrypt](https://www.npmjs.com/package/bcrypt) con [@types/bcrypt](https://www.npmjs.com/package/@types/bcrypt)
- **Validación:** [class-validator](https://github.com/typestack/class-validator) y [class-transformer](https://github.com/typestack/class-transformer)
- **Testing:** [Jest](https://jestjs.io/) para tests unitarios y e2e

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JoseDanielZ/Taller-JWT-Nest-JoseZumarraga-Postman.git
cd auth-practicajd

# Instalar dependencias
npm install
```

## ▶️ Ejecución

```bash
# Modo desarrollo (con hot reload)
npm run start:dev

# Modo producción
npm run start:prod

# Build del proyecto
npm run build
```

El servidor se ejecutará en: `http://localhost:8282`

## 📚 API Endpoints

### 🔓 Endpoints Públicos

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### 🔒 Endpoints Protegidos (Requieren JWT Token)

#### Obtener Perfil del Usuario
```http
GET /auth/profile
Authorization: Bearer <JWT_TOKEN>
```

#### Ruta Protegida de Ejemplo
```http
GET /auth/protected
Authorization: Bearer <JWT_TOKEN>
```

#### CRUD de Usuarios
```http
GET /users          # Listar todos los usuarios
POST /users         # Crear usuario
GET /users/:id      # Obtener usuario por ID
PATCH /users/:id    # Actualizar usuario
DELETE /users/:id   # Eliminar usuario
```

## 🧪 Testing con Postman

### 1. Importar Colección
- Descarga e importa la colección de Postman desde el repositorio
- O crea los requests manualmente apuntando a `http://localhost:8282`

### 2. Flujo de Testing

1. **Registro**: `POST /auth/register` - Crear un nuevo usuario
2. **Login**: `POST /auth/login` - Obtener token JWT
3. **Copiar Token**: Del response del login, copiar el `access_token`
4. **Configurar Auth**: En los requests protegidos, agregar header:
   ```
   Authorization: Bearer <TOKEN_AQUI>
   ```
5. **Probar Endpoints**: `/auth/profile`, `/auth/protected`, `/users/*`

### 3. Variables de Entorno
- `JWT_SECRET`: Secreto para firmar tokens (default: "mi_clave_secreta")
- `PORT`: Puerto del servidor (default: 8282)

## 📁 Estructura del Proyecto

```
src/
├── app.controller.ts          # Controller principal (Hello World)
├── app.module.ts              # Módulo raíz de la aplicación
├── app.service.ts             # Servicio principal
├── main.ts                    # Punto de entrada de la aplicación
├── auth/                      # Módulo de autenticación
│   ├── auth.controller.ts     # Endpoints de auth
│   ├── auth.module.ts         # Configuración del módulo auth
│   ├── auth.service.ts        # Lógica de autenticación
│   ├── dto/                   # Data Transfer Objects
│   │   ├── login.dto.ts       # DTO para login
│   │   └── register.dto.ts    # DTO para registro
│   ├── guards/                # Guards de protección
│   │   └── jwt-auth.guard.ts  # Guard JWT
│   └── strategies/            # Estrategias de Passport
│       └── jwt.strategy.ts    # Estrategia JWT
└── users/                     # Módulo de usuarios
    ├── entities/              # Entidades
    │   └── user.entity.ts     # Entidad User
    ├── users.controller.ts    # CRUD de usuarios
    ├── users.module.ts        # Configuración del módulo users
    └── users.service.ts       # Servicio de usuarios
```

## 🔧 Configuración

### Variables de Entorno (.env)
```env
JWT_SECRET=mi_clave_secreta
JWT_EXPIRES_IN=24h
PORT=8282
```

### JWT Configuration
- **Secret**: `mi_clave_secreta`
- **Expires In**: 24 horas
- **Algorithm**: HS256

## 📋 Requisitos del Taller

✅ **Registro de usuarios** con contraseñas hasheadas  
✅ **Sistema de login** que genera tokens JWT  
✅ **Protección de rutas** usando Guards  
✅ **Acceso a información** del usuario autenticado  
✅ **Validación de datos** con DTOs  
✅ **Separación modular** (auth/users)  
✅ **Documentación** completa del código  

## 🧪 Tests

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**José Daniel Zumárraga**  
- GitHub: [@JoseDanielZ](https://github.com/JoseDanielZ)
- LinkedIn: [José Daniel Zumárraga](https://linkedin.com/in/josedanielzumarraga)

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**

*Proyecto desarrollado como parte del taller de autenticación JWT con NestJS*
