<template>
  <BasePage>
    <template #header>{{ $t('app.resources') }}</template>

    <v-snackbar
      v-model="store.state.notification.visible"
      :color="store.state.notification.type"
      timeout="3000"
      location="top right"
    >
      {{ store.state.notification.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="store.dispatch('hideNotification')">✕</v-btn>
      </template>
    </v-snackbar>

    <BaseCard>
      <v-row align="center">
        <v-col>
          <v-select
            v-model="filterType"
            :items="typeItems"
            :label="$t('common.filterByType')"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
            {{ $t('resources.addResource') }}
          </v-btn>
        </v-col>
      </v-row>
    </BaseCard>

    <BaseCard>
      <v-data-table
        :items="filteredResources"
        :headers="headers"
        :items-per-page="10"
        hover
      >
        <template v-slot:item.type="{ item }">
          <v-chip :color="getTypeColor(item.type)" size="small" label>
            {{ $t(`resources.types.${item.type}`) }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'success' : 'grey'" size="small">
            {{ $t(`status.${item.status}`) }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="openEditDialog(item)" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="confirmDelete(item)" />
        </template>
      </v-data-table>
    </BaseCard>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ isEditing ? $t('resources.editResourceTitle') : $t('resources.addResourceTitle') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" :label="$t('common.name')" variant="outlined" class="mb-2" />
          <v-select v-model="form.type" :items="typeItems" :label="$t('common.type')" variant="outlined" class="mb-2" />
          <v-text-field v-model.number="form.capacity" :label="$t('common.capacity')" type="number" variant="outlined" class="mb-2" />
          <v-text-field v-model="form.responsible" :label="$t('common.responsible')" variant="outlined" class="mb-2" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="primary" @click="saveResource" :disabled="!form.name || !form.type || !form.responsible">
            {{ isEditing ? $t('common.save') : $t('common.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      v-model="deleteDialog"
      @confirm="handleDelete"
      @cancel="deleteDialog = false"
    >
      <template #title>{{ $t('resources.deleteConfirmTitle', { name: deleteTarget?.name }) }}</template>
      <template #confirmText>{{ $t('common.delete') }}</template>
      <template #cancelText>{{ $t('common.cancel') }}</template>
    </ConfirmDialog>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import BasePage from '../components/BasePage.vue'
import BaseCard from '../components/BaseCard.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const store = useStore()
const { t, locale } = useI18n()

const filterType = ref(null)

const typeItems = computed(() => [
  { title: t('resources.types.room'), value: 'room' },
  { title: t('resources.types.person'), value: 'person' },
  { title: t('resources.types.equipment'), value: 'equipment' }
])

const headers = computed(() => [
  { title: t('common.name'), key: 'name' },
  { title: t('common.type'), key: 'type' },
  { title: t('common.capacity'), key: 'capacity' },
  { title: t('common.responsible'), key: 'responsible' },
  { title: t('common.status'), key: 'status' },
  { title: t('common.actions'), key: 'actions', sortable: false }
])

const filteredResources = computed(() => {
  if (!filterType.value) return store.getters.allResources
  return store.getters.allResources.filter(r => r.type === filterType.value)
})

const getTypeColor = (type) => {
  return { room: 'primary', person: 'warning', equipment: 'info' }[type] || 'grey'
}

const dialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const form = ref({ name: '', type: 'room', capacity: 1, responsible: '' })

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', type: 'room', capacity: 1, responsible: '' }
  dialog.value = true
}

const openEditDialog = (resource) => {
  isEditing.value = true
  editingId.value = resource.id
  form.value = { ...resource }
  dialog.value = true
}

const saveResource = () => {
  if (isEditing.value) {
    store.dispatch('updateResource', { ...form.value, id: editingId.value })
  } else {
    store.dispatch('addResource', { ...form.value })
  }
  dialog.value = false
}

const deleteDialog = ref(false)
const deleteTarget = ref(null)

const confirmDelete = (resource) => {
  deleteTarget.value = resource
  deleteDialog.value = true
}

const handleDelete = () => {
  store.dispatch('deleteResource', deleteTarget.value.id)
  deleteDialog.value = false
  deleteTarget.value = null
}

onMounted(() => {
  store.dispatch('loadData')
})
</script>
