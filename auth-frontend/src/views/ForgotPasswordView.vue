<!--
  Archivo: src/views/ForgotPasswordView.vue
  Propósito: RETO C - Página para recuperar contraseña
  
  Funcionalidad:
  - Formulario simple que solo pide el email
  - Muestra un mensaje genérico de seguridad
  - (En una app real, enviaría un email con link para resetear)
-->
<template>
  <div class="forgot-container">
    <div class="forgot-card">
      <h1>Recuperar Contraseña</h1>
      
      <!-- Explicación -->
      <p class="explanation">
        Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
      </p>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleForgotPassword" v-if="!successMessage">
        
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
          />
        </div>

        <!-- Botón de submit -->
        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Enviando...' : 'Enviar Instrucciones' }}
        </button>
      </form>

      <!-- Links para volver -->
      <div class="links">
        <p class="back-link">
          ¿Recordaste tu contraseña? 
          <router-link to="/login">Volver al login</router-link>
        </p>
        <p class="back-link">
          ¿No tienes cuenta? 
          <router-link to="/register">Regístrate aquí</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Variables del formulario
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

/**
 * RETO C: Manejar la solicitud de recuperar contraseña
 * 
 * En una aplicación real, esto:
 * 1. Enviaría el email al backend
 * 2. El backend buscaría el usuario
 * 3. Crearía un link de recuperación
 * 4. Enviaría un email con el link
 * 
 * Aquí hacemos una versión simplificada
 */
const handleForgotPassword = async () => {
  // Limpiar mensajes anteriores
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Simular envío al servidor (en una app real aquí iría un await api.post())
    // Esperamos 1 segundo para simular que se está procesando
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mostrar mensaje de éxito
    // Este mensaje es genérico por seguridad:
    // No decimos si el email existe o no (para evitar que alguien adivine emails)
    successMessage.value = '✓ Si la cuenta existe, recibirás un correo con instrucciones para resetear tu contraseña.\n\nRevisa tu bandeja de entrada en los próximos minutos.'

    // Después de 4 segundos, redirigir al login
    setTimeout(() => {
      router.push('/login')
    }, 4000)

  } catch (error) {
    // Si hay un error, mostrarlo
    errorMessage.value = error.message || 'Error al procesar tu solicitud'
  } finally {
    // Permitir intentar de nuevo
    isLoading.value = false
  }
}
</script>

<style scoped>
.forgot-container {
  /* Centrar la tarjeta en la pantalla */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.forgot-card {
  /* Tarjeta blanca */
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  /* Título */
  margin-bottom: 16px;
  text-align: center;
  color: #333;
  font-size: 24px;
}

.explanation {
  /* Explicación del formulario */
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.form-group {
  /* Grupo de campo (label + input) */
  margin-bottom: 20px;
}

label {
  /* Etiquetas de campos */
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

input {
  /* Campos de entrada */
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  /* Efecto al enfocar */
  outline: none;
  border-color: #2196F3;
}

input:disabled {
  /* Cuando está deshabilitado */
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-primary {
  /* Botón principal */
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
  /* Mensaje de error */
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  /* Mensaje de éxito */
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
  white-space: pre-line;
}

.links {
  /* Contenedor de links */
  margin-top: 24px;
}

.back-link {
  /* Links para navegar */
  text-align: center;
  margin: 12px 0;
  color: #666;
  font-size: 14px;
}

.back-link a {
  color: #2196F3;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
