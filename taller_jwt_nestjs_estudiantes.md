# Taller: Autenticación con JWT y Guards en NestJS
## Desarrollo en Plataformas - PUCE

---

## Información del Taller

| Aspecto | Detalle |
|---------|---------|
| **Tema** | Autenticación JWT en APIs REST |
| **Duración estimada** | 2 horas |
| **Entregable** | Proyecto NestJS con registro, login y rutas protegidas |

---

## Objetivos

Al completar este taller podrás:
- ✅ Implementar registro de usuarios con contraseñas hasheadas
- ✅ Crear sistema de login que genera tokens JWT
- ✅ Proteger rutas usando Guards
- ✅ Acceder a la información del usuario autenticado

---

## Conceptos Clave

### ¿Qué es JWT?

JWT (JSON Web Token) es como un **brazalete de hotel all-inclusive**:
- Te registras (login) → recibes un brazalete (token)
- Para acceder al buffet, piscina, bar → muestras el brazalete
- El personal verifica el brazalete sin llamar a recepción cada vez
- Si alguien falsifica el brazalete → el código no coincide y se rechaza

### ¿Qué es un Guard?

Un Guard es un **guardia de seguridad** que verifica tu token antes de dejarte entrar a una ruta protegida.

---

## Parte 1: Configuración del Proyecto

### Paso 1.1: Crear proyecto NestJS

```bash
nest new auth-taller
cd auth-taller
```

### Paso 1.2: Instalar dependencias

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
npm install -D @types/passport-jwt @types/bcrypt
```

### Paso 1.3: Generar módulos con CLI

```bash
# Módulo de autenticación (sin CRUD)
nest g resource auth --no-spec
# Seleccionar: REST API → No

# Módulo de usuarios (con CRUD)
nest g resource users --no-spec
# Seleccionar: REST API → Yes
```

### Paso 1.4: Habilitar validación global

Editar `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Elimina propiedades no definidas en el DTO
    transform: true,  // Transforma tipos automáticamente
  }));
  
  await app.listen(3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
}
bootstrap();
```

---

## Parte 2: Módulo de Usuarios

### Paso 2.1: Definir la entidad de Usuario

Editar `src/users/entities/user.entity.ts`:

```typescript
export class User {
  // genera un prompt para que agrege las columnas, consus caracteristicas, bien detallado
}
```

### Paso 2.2: Implementar el servicio de usuarios

Editar `src/users/users.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // Simulamos base de datos con un array
  private users: User[] = [];
  private idCounter = 1;

  // Crear nuevo usuario
  create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: this.idCounter++,
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Buscar usuario por email
  findByEmail(email: string): User | undefined {
    // genera el codigo
  }

  // Buscar usuario por ID
  findById(id: number): User | undefined {
    // genera el codigo
  }

  // Obtener todos los usuarios (sin contraseñas)
  findAll(): Omit<User, 'password'>[] {
    // genera el codigo
  }
}
```

### Paso 2.3: Exportar el servicio

Editar `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // ⚠️ IMPORTANTE: Exportar para usar en AuthModule. Si no lo exportas no podras utilizar este servicio necesario en el modulo Auth
})
export class UsersModule {}
```

---

## Parte 3: DTOs de Autenticación

### Paso 3.1: Crear DTO de Registro

Crear archivo `src/auth/dto/register.dto.ts`:

```typescript
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  // Que deberia tener este DTO?
}
```

### Paso 3.2: Crear DTO de Login

Crear archivo `src/auth/dto/login.dto.ts`:

```typescript
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  // Que deberia tener este DTO?
}
```

---

## Parte 4: Servicio de Autenticación

### Paso 4.1: Implementar AuthService

Editar `src/auth/auth.service.ts`:

```typescript
import { 
  Injectable, 
  ConflictException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * REGISTRO DE USUARIO
   * 1. Verifica que el email no exista
   * 2. Hashea la contraseña
   * 3. Crea el usuario
   * 4. Retorna usuario sin contraseña
   * 5. algo mas? esta bien este algoritmo?
   */
  async register(registerDto: RegisterDto) {
    // implementa el algoritmo
    
    return {
      // Retorna una respuesta
    };
  }

  /**
   * LOGIN DE USUARIO
   * 1. Busca usuario por email
   * 2. Verifica contraseña
   * 3. Genera token JWT
   * 4. Qué debería retornar?
   */
  async login(loginDto: LoginDto) {
   // Desarrolla la logica

    return {
      Qué retornamos
    };
  }

  /**
   * OBTENER PERFIL
   * Retorna información del usuario autenticado
   */
  getProfile(userId: number) {
   // Desarrolla la logica
  }
}
```

---

## Parte 5: Estrategia JWT y Guard

### Paso 5.1: Crear estrategia JWT

Crear archivo `src/auth/strategies/jwt.strategy.ts`:

```typescript
// src/auth/strategies/jwt.strategy.ts

// ============================================
// IMPORTACIONES NECESARIAS
// ============================================

// Injectable: Decorador que permite inyectar este servicio en otros componentes
import { Injectable } from '@nestjs/common';

// PassportStrategy: Clase base que conecta NestJS con la librería Passport
// Passport es una librería de autenticación muy popular en Node.js
import { PassportStrategy } from '@nestjs/passport';

// ExtractJwt: Utilidad que nos ayuda a extraer el token de diferentes lugares
// Strategy: La estrategia específica para validar tokens JWT
import { ExtractJwt, Strategy } from 'passport-jwt';

// ============================================
// CONFIGURACIÓN DEL SECRETO
// ============================================

// JWT_SECRET: Clave secreta usada para FIRMAR y VERIFICAR tokens
// - Esta clave NUNCA debe compartirse públicamente
// - En producción, debe estar en variables de entorno (.env)
// - Si alguien conoce esta clave, puede crear tokens falsos
// - Debe ser una cadena larga y aleatoria
export const JWT_SECRET = 'mi_clave_secreta_muy_segura_2024';

// ============================================
// ESTRATEGIA JWT
// ============================================

// @Injectable(): Marca esta clase como un "proveedor" de NestJS
// Esto permite que NestJS la inyecte automáticamente donde se necesite
@Injectable()

// La clase extiende PassportStrategy y le pasa la Strategy de JWT
// Esto conecta nuestra estrategia con el sistema de autenticación de Passport
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  // ========================================== 
  // CONSTRUCTOR: CONFIGURACIÓN DE LA ESTRATEGIA
  // ========================================== 
  constructor() {
    // super() llama al constructor de la clase padre (PassportStrategy)
    // Le pasamos un objeto de configuración con las opciones de JWT
    super({
      
      // ------------------------------------------
      // jwtFromRequest: ¿De dónde extraemos el token?
      // ------------------------------------------
      // ExtractJwt.fromAuthHeaderAsBearerToken() busca el token en:
      // Header HTTP: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
      //                              ^^^^^^^ Prefijo obligatorio
      //                                      ^^^^^^^^^^^^^^^^^^^^^ Token JWT
      // 
      // Otras opciones disponibles (no usadas aquí):
      // - fromHeader('x-token'): Busca en un header personalizado
      // - fromBodyField('token'): Busca en el body de la petición
      // - fromUrlQueryParameter('token'): Busca en ?token=xxx
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // ------------------------------------------
      // ignoreExpiration: ¿Aceptamos tokens expirados?
      // ------------------------------------------
      // false = NO aceptar tokens expirados (RECOMENDADO para seguridad)
      // true  = Aceptar tokens aunque hayan expirado (INSEGURO)
      //
      // Cuando un token expira, el usuario debe hacer login nuevamente
      // Esto es una medida de seguridad: si alguien roba un token,
      // solo funcionará por tiempo limitado
      ignoreExpiration: false,

      // ------------------------------------------
      // secretOrKey: Clave para VERIFICAR la firma del token
      // ------------------------------------------
      // Esta debe ser EXACTAMENTE la misma clave usada para FIRMAR el token
      // Si las claves no coinciden, el token será rechazado
      //
      // ¿Cómo funciona la verificación?
      // 1. El servidor recibe el token
      // 2. Extrae el header y payload del token
      // 3. Usa esta clave para recalcular la firma
      // 4. Compara la firma calculada con la firma del token
      // 5. Si coinciden → token válido, si no → token rechazado
      secretOrKey: JWT_SECRET,
    });
  }

  // ==========================================
  // MÉTODO VALIDATE: PROCESAR TOKEN VÁLIDO
  // ==========================================
  
  // Este método se ejecuta AUTOMÁTICAMENTE cuando:
  // 1. Se recibe un token en el header Authorization
  // 2. El token tiene una firma válida (verificada con secretOrKey)
  // 3. El token NO ha expirado (si ignoreExpiration es false)
  //
  // IMPORTANTE: Si llegamos aquí, el token YA FUE VALIDADO
  // No necesitamos verificar la firma manualmente
  //
  // Parámetro "payload": Es el contenido decodificado del token
  // Ejemplo de payload que recibiríamos:
  // {
  //   sub: 1,                    // ID del usuario (subject)
  //   email: "juan@test.com",    // Email del usuario
  //   nombre: "Juan Pérez",      // Nombre del usuario
  //   iat: 1705312200,           // Issued At: cuándo se creó el token
  //   exp: 1705398600            // Expiration: cuándo expira el token
  // }
  async validate(payload: any) {
    
    // Lo que retornemos aquí se adjuntará a la petición HTTP
    // Estará disponible en req.user en cualquier controlador
    //
    // Ejemplo de uso en un controlador:
    // @Get('profile')
    // getProfile(@Request() req) {
    //   console.log(req.user.userId);  // 1
    //   console.log(req.user.email);   // "juan@test.com"
    // }
    //
    // NOTA: Retornamos solo los datos necesarios, no todo el payload
    // Esto es una buena práctica de seguridad (principio de mínimo privilegio)
    return {
      userId: payload.sub,      // Mapeamos "sub" a "userId" para mayor claridad
      email: payload.email,     // Email del usuario autenticado
      nombre: payload.nombre,   // Nombre del usuario autenticado
    };
    
    // NOTA AVANZADA: Aquí podríamos hacer validaciones adicionales:
    // - Verificar que el usuario aún existe en la base de datos
    // - Verificar que el usuario no esté bloqueado
    // - Verificar que el token no esté en una "lista negra"
    // 
    // Ejemplo:
    // const user = await this.usersService.findById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException('Usuario no encontrado');
    // }
    // if (user.bloqueado) {
    //   throw new UnauthorizedException('Usuario bloqueado');
    // }
    // return user;
  }
}

// ============================================
// FLUJO COMPLETO DE AUTENTICACIÓN
// ============================================
//
// 1. Usuario hace login → recibe token JWT
//
// 2. Usuario hace petición a ruta protegida:
//    GET /auth/profile
//    Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..." }
//
// 3. JwtAuthGuard intercepta la petición
//
// 4. Guard llama a JwtStrategy automáticamente
//
// 5. JwtStrategy:
//    a) Extrae token del header (jwtFromRequest)
//    b) Verifica firma con la clave secreta (secretOrKey)
//    c) Verifica que no haya expirado (ignoreExpiration)
//    d) Si todo OK → llama a validate() con el payload
//    e) Si algo falla → lanza error 401 Unauthorized
//
// 6. validate() retorna objeto con datos del usuario
//
// 7. Guard permite continuar, datos disponibles en req.user
//
// 8. Controlador procesa la petición con acceso a req.user
```