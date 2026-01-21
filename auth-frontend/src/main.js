/**
 * Archivo: src/main.js
 * Propósito: Punto de entrada de la aplicación Vue
 * 
 * Aquí se:
 * - Crea la instancia de Vue
 * - Registra plugins (como Vue Router)
 * - Importa los estilos globales (incluyendo temas)
 * - Monta la aplicación en el DOM
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// RETO D: Importar los estilos de tema claro/oscuro
import './styles/themes.css'

// Crear la aplicación Vue
const app = createApp(App)

// Registrar el router
app.use(router)

// Montar en el elemento #app del index.html
app.mount('#app')