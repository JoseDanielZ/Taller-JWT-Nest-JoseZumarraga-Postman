<!--
  Archivo: src/components/ThemeToggle.vue
  Propósito: RETO D - Componente para cambiar entre tema claro y oscuro
  
  Funcionalidad:
  - Botón para cambiar tema
  - Guarda la preferencia en localStorage
  - Aplica los colores automáticamente
-->
<template>
  <div class="theme-toggle">
    <!-- Botón para alternar tema -->
    <button @click="toggleTheme" class="toggle-btn" :title="isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
      <!-- Mostrar icono diferente según el tema -->
      <span v-if="isDarkMode" class="icon">☀️</span>
      <span v-else class="icon">🌙</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

/**
 * Cambiar tema y guardar preferencia
 */
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  applyTheme(isDarkMode.value)
  localStorage.setItem('theme_mode', isDarkMode.value ? 'dark' : 'light')
}

/**
 * Aplicar el tema al HTML
 */
const applyTheme = (isDark) => {
  const html = document.documentElement
  
  if (isDark) {
    html.classList.add('dark-theme')
    document.body.style.backgroundColor = '#2d2d2d'
    document.body.style.color = '#e8e8e8'
  } else {
    html.classList.remove('dark-theme')
    document.body.style.backgroundColor = '#f5f5f5'
    document.body.style.color = '#333333'
  }
}

/**
 * Cargar tema guardado al abrir la app
 */
const loadTheme = () => {
  const saved = localStorage.getItem('theme_mode')
  const isDark = saved === 'dark'
  isDarkMode.value = isDark
  applyTheme(isDark)
}

// Ejecutar cuando el componente se monta
onMounted(() => {
  loadTheme()
})
</script>

<style scoped>
.theme-toggle {
  /* Contenedor del botón - ABAJO A LA DERECHA */
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.toggle-btn {
  /* Botón para cambiar tema */
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.toggle-btn:hover {
  /* Efecto al pasar el mouse */
  background-color: #e0e0e0;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.toggle-btn:active {
  /* Efecto al hacer clic */
  transform: scale(0.95);
}

.icon {
  /* El icono (sol o luna) */
  display: inline-block;
  pointer-events: none;
}
</style>
