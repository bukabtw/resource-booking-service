<template>
  <div>
    <slot v-if="items.length === 0" name="empty">
      <v-card class="pa-8 text-center">
        <v-icon size="64" color="grey">{{ emptyIcon }}</v-icon>
        <p class="text-h6 text-grey mt-4">{{ emptyText }}</p>
      </v-card>
    </slot>
    <v-list v-else bg-color="transparent">
      <slot v-for="(item, index) in items" :key="item.id || index" name="item" :item="item" :index="index" />
    </v-list>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  emptyIcon: { type: String, default: 'mdi-alert-circle-outline' },
  emptyText: { type: String, default: 'Список пуст' }
})
</script>
