<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400">
    <v-card>
      <v-card-title><slot name="title">Подтверждение</slot></v-card-title>
      <v-card-text><slot>Вы уверены?</slot></v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('cancel')"><slot name="cancelText">Отмена</slot></v-btn>
        <v-btn color="error" variant="flat" @click="$emit('confirm')"><slot name="confirmText">Подтвердить</slot></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})
defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>
