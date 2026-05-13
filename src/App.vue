<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>{{ $t('app.title') }}</v-app-bar-title>
      <template v-slot:append>
        <v-btn to="/" prepend-icon="mdi-calendar" variant="text" color="white" class="mx-1">{{ $t('app.calendar') }}</v-btn>
        <v-btn to="/bookings" prepend-icon="mdi-book-open" variant="text" color="white" class="mx-1">{{ $t('app.bookings') }}</v-btn>
        <v-btn to="/resources" prepend-icon="mdi-folder" variant="text" color="white" class="mx-1">{{ $t('app.resources') }}</v-btn>
        <v-btn to="/stats" prepend-icon="mdi-chart-bar" variant="text" color="white" class="mx-1">{{ $t('app.stats') }}</v-btn>
        <v-btn to="/about" prepend-icon="mdi-information" variant="text" color="white" class="mx-1">{{ $t('app.about') }}</v-btn>
        <v-btn @click="toggleLocale" variant="text" color="white" size="small" class="mx-1">
          {{ currentLocaleLabel }}
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

    <v-footer app color="primary" class="text-white justify-center">
      <span>{{ $t('app.footer') }}</span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const currentLocaleLabel = computed(() => locale.value === 'ru' ? 'RU' : 'EN')

function toggleLocale() {
  locale.value = locale.value === 'ru' ? 'en' : 'ru'
  localStorage.setItem('app-locale', locale.value)
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
