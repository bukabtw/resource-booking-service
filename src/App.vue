<template>
  <v-app>
    <v-app-bar prominent>
      <v-app-bar-title><span class="glass-text">{{ $t('app.title') }}</span></v-app-bar-title>
      <template v-slot:append>
        <v-btn to="/" prepend-icon="mdi-calendar" variant="text" class="mx-1 nav-link">{{ $t('app.calendar') }}</v-btn>
        <v-btn to="/bookings" prepend-icon="mdi-book-open" variant="text" class="mx-1 nav-link">{{ $t('app.bookings') }}</v-btn>
        <v-btn to="/resources" prepend-icon="mdi-folder" variant="text" class="mx-1 nav-link">{{ $t('app.resources') }}</v-btn>
        <v-btn to="/stats" prepend-icon="mdi-chart-bar" variant="text" class="mx-1 nav-link">{{ $t('app.stats') }}</v-btn>
        <v-btn to="/about" prepend-icon="mdi-information" variant="text" class="mx-1 nav-link">{{ $t('app.about') }}</v-btn>
        <v-btn icon variant="text" @click="toggleTheme" class="mr-2">
          <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
        <v-btn
          variant="text"
          size="small"
          @click="toggleLocale"
          class="glass-toggle mr-2"
        >
          {{ currentLocale.toUpperCase() }}
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>

    <v-footer app class="justify-center">
      <span>{{ $t('app.footer') }}</span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const { locale } = useI18n()
const theme = useTheme()

const currentLocale = ref(locale.value)

const toggleLocale = () => {
  const newLocale = locale.value === 'ru' ? 'en' : 'ru'
  locale.value = newLocale
  currentLocale.value = newLocale
  localStorage.setItem('app-locale', newLocale)
}

watch(locale, (val) => {
  currentLocale.value = val
})

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('app-theme', theme.global.name.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme')
  if (savedTheme) theme.global.name.value = savedTheme
})
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.v-application {
  transition: background 0.5s ease;
}
.v-application.v-theme--dark {
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e) !important;
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-bg-header: rgba(255, 255, 255, 0.05);
  --glass-bg-hover: rgba(255, 255, 255, 0.08);
  --glass-text-secondary: rgba(255, 255, 255, 0.6);
}
.v-application.v-theme--light {
  background: linear-gradient(135deg, #e0e7ff, #f0e6ff, #fce7f3) !important;
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-bg-header: rgba(0, 0, 0, 0.03);
  --glass-bg-hover: rgba(0, 0, 0, 0.05);
  --glass-text-secondary: rgba(0, 0, 0, 0.6);
}
.v-card {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 16px !important;
  transition: all 0.3s ease !important;
}
.v-theme--dark .v-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}
.v-theme--light .v-card {
  background: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.1) !important;
}
.v-card:hover {
  border-color: rgba(124, 58, 237, 0.3) !important;
}
.v-app-bar {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.v-theme--dark .v-app-bar {
  background: rgba(15, 12, 41, 0.8) !important;
}
.v-theme--light .v-app-bar {
  background: rgba(255, 255, 255, 0.8) !important;
}
.v-footer {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.v-theme--dark .v-footer {
  background: rgba(15, 12, 41, 0.8) !important;
}
.v-theme--light .v-footer {
  background: rgba(255, 255, 255, 0.8) !important;
}
.v-btn {
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 500 !important;
}
.v-field {
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border-radius: 12px !important;
}
.v-theme--dark .v-field {
  background: rgba(255, 255, 255, 0.03) !important;
}
.v-theme--light .v-field {
  background: rgba(0, 0, 0, 0.02) !important;
}
.v-chip {
  backdrop-filter: blur(10px) !important;
  border-radius: 8px !important;
}
.v-table {
  backdrop-filter: blur(10px) !important;
  border-radius: 12px !important;
}
.day-header.today {
  border-radius: 8px;
}
.v-theme--dark .day-header.today {
  background: rgba(124, 58, 237, 0.15) !important;
}
.v-theme--light .day-header.today {
  background: rgba(124, 58, 237, 0.1) !important;
}
.booking-block {
  backdrop-filter: blur(5px) !important;
  border-radius: 8px !important;
}
.booking-block.status-confirmed {
  background: rgba(16, 185, 129, 0.2) !important;
  border-left: 3px solid #10b981 !important;
}
.booking-block.status-pending {
  background: rgba(245, 158, 11, 0.2) !important;
  border-left: 3px solid #f59e0b !important;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.3);
  border-radius: 4px;
}
.glass-text {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-h4 {
  color: #ffffff !important;
}
.v-theme--light .text-h4 {
  color: #1a1a2e !important;
}
.v-main {
  position: relative;
}
.v-main::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
  animation: bgMove 20s ease-in-out infinite alternate;
}
@keyframes bgMove {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-5%, -5%) rotate(5deg); }
}
.v-main > * {
  position: relative;
  z-index: 1;
}
.stat-card {
  color: #ffffff;
}
.v-theme--light .stat-card {
  color: #1a1a2e !important;
}
.v-theme--light .stat-card .v-icon {
  color: inherit !important;
}
.nav-link {
  color: #ffffff !important;
}
.v-theme--light .nav-link {
  color: #1a1a2e !important;
}
.v-theme--light .text-grey {
  color: rgba(0, 0, 0, 0.6) !important;
}
.v-theme--light .text-white {
  color: #1a1a2e !important;
}
.glass-toggle {
  backdrop-filter: blur(10px) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  min-width: 48px !important;
}
</style>
