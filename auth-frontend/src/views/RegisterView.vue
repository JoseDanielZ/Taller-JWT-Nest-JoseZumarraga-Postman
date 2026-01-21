<!--
  Archivo: src/views/RegisterView.vue
  Propósito: Página de registro para nuevos usuarios
  
  Funcionalidad:
  - Formulario con nombre, email y password
  - Confirmación de contraseña
  - Validación de que las contraseñas coincidan
  - Envío de datos al backend para crear cuenta
  - Redirección a login después de registro exitoso
-->
<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crear Cuenta</h1>
      
      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        
        <!-- Campo de nombre -->
        <div class="form-group">
          <label for="name">Nombre Completo</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Tu nombre"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Campo de email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            :disabled="isLoading"
            @blur="validateEmail"
          />
          <!-- Mensaje si el email no es válido -->
          <span v-if="email && !isValidEmail" class="validation-error">
            Por favor, ingresa un email válido (ejemplo: usuario@gmail.com)
          </span>
        </div>

        <!-- Campo de contraseña -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            :disabled="isLoading"
            @input="checkPasswordStrength"
          />
          
          <!-- Mostrar requisitos de contraseña -->
          <div v-if="password" class="password-requirements">
            <p class="requirement-title">Tu contraseña debe tener:</p>
            <div class="requirement" :class="{ met: password.length >= 8 }">
              ✓ Al menos 8 caracteres (tienes {{ password.length }})
            </div>
            <div class="requirement" :class="{ met: hasUpperCase }">
              ✓ Al menos una MAYÚSCULA (ejemplo: A, B, C)
            </div>
            <div class="requirement" :class="{ met: hasLowerCase }">
              ✓ Al menos una minúscula (ejemplo: a, b, c)
            </div>
            <div class="requirement" :class="{ met: hasNumber }">
              ✓ Al menos un número (0-9)
            </div>
            <div class="requirement" :class="{ met: hasSpecialChar }">
              ✓ Al menos un símbolo especial (!@#$%^&*)
            </div>
            
            <!-- Indicador visual de fortaleza -->
            <div class="strength-indicator">
              <p>Fortaleza: <strong :style="{ color: passwordStrengthColor }">{{ passwordStrengthText }}</strong></p>
              <div class="strength-bar">
                <div class="strength-fill" :style="{ width: passwordStrengthPercent + '%', backgroundColor: passwordStrengthColor }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Campo de confirmar contraseña -->
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            required
            :disabled="isLoading"
          />
          <!-- Mensaje de validación de contraseñas -->
          <span v-if="confirmPassword && password !== confirmPassword" class="validation-error">
            Las contraseñas no coinciden
          </span>
        </div>

        <!-- Botón de submit -->
        <button 
          type="submit" 
          :disabled="isLoading || (confirmPassword && password !== confirmPassword)"
          class="btn-primary"
        >
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>

      <!-- Link para ir a login -->
      <p class="login-link">
        ¿Ya tienes cuenta? 
        <router-link to="/login">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

const router = useRouter()

// Variables reactivas del formulario
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Variables para validaciones
const isValidEmail = ref(true)
const hasUpperCase = ref(false)      // ¿Tiene letras MAYÚSCULAS?
const hasLowerCase = ref(false)      // ¿Tiene letras minúsculas?
const hasNumber = ref(false)         // ¿Tiene números?
const hasSpecialChar = ref(false)    // ¿Tiene símbolos especiales?
const passwordStrengthText = ref('Débil')
const passwordStrengthColor = ref('#f44336')
const passwordStrengthPercent = ref(0)

/**
 * VALIDAR EMAIL
 * Verifica que el email tenga formato correcto (usuario@dominio.com)
 * Se ejecuta cuando el usuario sale del campo de email
 */
const validateEmail = () => {
  // Patrón para validar email: debe tener @ y un punto después del @
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isValidEmail.value = emailPattern.test(email.value)
}

/**
 * REVISAR FORTALEZA DE CONTRASEÑA
 * Analiza qué tan segura es la contraseña mirando:
 * - Si tiene letras MAYÚSCULAS
 * - Si tiene letras minúsculas
 * - Si tiene números
 * - Si tiene símbolos especiales
 * - La cantidad de caracteres
 */
const checkPasswordStrength = () => {
  const pwd = password.value
  
  // Verificar MAYÚSCULAS: ¿hay al menos una letra grande? (A-Z)
  hasUpperCase.value = /[A-Z]/.test(pwd)
  
  // Verificar minúsculas: ¿hay al menos una letra pequeña? (a-z)
  hasLowerCase.value = /[a-z]/.test(pwd)
  
  // Verificar números: ¿hay al menos un dígito? (0-9)
  hasNumber.value = /\d/.test(pwd)
  
  // Verificar símbolos especiales: ¿hay caracteres como !@#$%^&*?
  hasSpecialChar.value = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  
  // CALCULAR LA FORTALEZA (puntuación de 0 a 5)
  let strength = 0
  if (pwd.length >= 8) strength++      // +1 si tiene 8+ caracteres
  if (hasUpperCase.value) strength++   // +1 si tiene mayúsculas
  if (hasLowerCase.value) strength++   // +1 si tiene minúsculas
  if (hasNumber.value) strength++      // +1 si tiene números
  if (hasSpecialChar.value) strength++ // +1 si tiene símbolos
  
  // Convertir puntuación a porcentaje y mensaje
  passwordStrengthPercent.value = (strength / 5) * 100
  
  // Mostrar texto y color según fortaleza
  if (strength <= 1) {
    passwordStrengthText.value = 'Muy Débil'
    passwordStrengthColor.value = '#f44336' // Rojo
  } else if (strength === 2) {
    passwordStrengthText.value = 'Débil'
    passwordStrengthColor.value = '#ff9800' // Naranja
  } else if (strength === 3) {
    passwordStrengthText.value = 'Normal'
    passwordStrengthColor.value = '#ffc107' // Amarillo
  } else if (strength === 4) {
    passwordStrengthText.value = 'Fuerte'
    passwordStrengthColor.value = '#8bc34a' // Verde claro
  } else {
    passwordStrengthText.value = 'Muy Fuerte'
    passwordStrengthColor.value = '#4caf50' // Verde oscuro
  }
}

/**
 * VERIFICAR SI EL FORMULARIO ES VÁLIDO
 * El formulario solo se puede enviar si TODO está correcto
 */
const isFormValid = computed(() => {
  // Nombre: debe tener al menos 2 caracteres
  const validName = name.value.length >= 2
  
  // Email: debe ser válido y no estar vacío
  const validEmail = isValidEmail.value && email.value.length > 0
  
  // Contraseña: debe cumplir todos los requisitos de seguridad
  const validPassword = 
    password.value.length >= 8 &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  
  // Las contraseñas deben coincidir
  const passwordsMatch = password.value === confirmPassword.value && confirmPassword.value.length > 0
  
  // TODO debe ser válido para poder enviar el formulario
  return validName && validEmail && validPassword && passwordsMatch
})

/**
 * MANEJAR REGISTRO
 * Cuando el usuario hace clic en "Crear Cuenta"
 */
const handleRegister = async () => {
  // Verificación final: si el formulario no es válido, mostrar error
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, completa todos los campos correctamente'
    return
  }

  // Limpiar mensajes anteriores
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Enviar datos al servidor
    await authService.register({
      nombre: name.value,
      email: email.value,
      password: password.value
    })

    // ¡Éxito! Mostrar mensaje y redirigir al login
    successMessage.value = '¡Cuenta creada exitosamente! Redirigiendo al login...'
    
    // Esperar 2 segundos antes de ir al login
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error) {
    // Si algo sale mal, mostrar el error
    errorMessage.value = error.message || 'Error al crear la cuenta'
  } finally {
    // Permitir al usuario intentar de nuevo
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Los estilos son similares al login, con algunas adiciones */

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 24px;
  text-align: center;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2196F3;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1976D2;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.validation-error {
  color: #c62828;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Estilos para los requisitos de contraseña */
.password-requirements {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 13px;
}

.requirement-title {
  margin: 0 0 8px 0;
  color: #666;
  font-weight: bold;
  font-size: 12px;
}

/* Cada requisito (mayúsculas, números, etc.) */
.requirement {
  padding: 6px 0;
  color: #999;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

/* Cuando el requisito se cumple, se pone verde */
.requirement.met {
  color: #4caf50;
  font-weight: bold;
}

/* Indicador visual de fortaleza de contraseña */
.strength-indicator {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ddd;
}

.strength-indicator p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
}

/* Barra de fortaleza */
.strength-bar {
  width: 100%;
  height: 6px;
  background-color: #ddd;
  border-radius: 3px;
  overflow: hidden;
}

/* La parte de la barra que se llena según la fortaleza */
.strength-fill {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
  border-radius: 3px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #2196F3;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>