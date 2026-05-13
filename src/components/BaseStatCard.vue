<template>
  <v-card :color="color" class="text-white text-center pa-6" elevation="3">
    <slot name="icon"><v-icon size="48">{{ icon }}</v-icon></slot>
    <div class="text-h3 mt-2">
      <slot name="value" :value="value" :formattedValue="formattedValue">{{ formattedValue }}</slot>
    </div>
    <div class="text-subtitle-1"><slot name="label" /></div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: { type: String, default: 'primary' },
  icon: { type: String, default: 'mdi-check-circle' },
  value: { type: Number, default: 0 }
})

const formattedValue = computed(() => props.value.toString())
</script>
