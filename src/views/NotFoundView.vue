<template>
  <v-container class="text-center mt-16">
    <v-icon size="120" color="grey">mdi-alert-circle-outline</v-icon>
    <h1 class="text-h2 mt-4">404</h1>
    <p class="text-h5 text-grey">{{ $t('notFound.title') }}</p>
    <p class="text-grey mt-2">{{ $t('notFound.description') }}</p>
    <v-btn color="primary" size="large" to="/" class="mt-6">
      {{ $t('notFound.goHome') }}
    </v-btn>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
