<template>
  <BasePage>
    <template #header>{{ $t('notFound.title') }}</template>
    <v-card class="text-center pa-8">
      <v-icon size="64" color="grey" class="mb-4">mdi-alert-circle-outline</v-icon>
      <p class="text-h6">{{ $t('notFound.title') }}</p>
      <v-btn to="/" color="primary" class="mt-4">{{ $t('notFound.goHome') }}</v-btn>
    </v-card>
  </BasePage>
</template>

<script setup>
import BasePage from '../components/BasePage.vue'
</script>
