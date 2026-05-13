<template>
  <v-card class="mb-4" elevation="2">
    <v-card-title v-if="$slots.title || title"><slot name="title">{{ title }}</slot></v-card-title>
    <v-card-text><slot /></v-card-text>
    <v-card-actions v-if="$slots.actions"><slot name="actions" /></v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' }
})
</script>
