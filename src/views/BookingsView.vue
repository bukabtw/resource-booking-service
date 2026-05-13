<template>
  <BasePage>
    <template #header>{{ $t('app.bookings') }}</template>

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
        <v-col cols="12" sm="3">
          <v-select
            v-model="filterStatus"
            :items="statusOptions"
            :label="$t('common.status')"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filterResource"
            :items="resourceOptions"
            :label="$t('common.resource')"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="filterDate"
            :label="$t('bookings.form.date')"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" sm="2" class="text-right">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            :to="{ name: 'new-booking' }"
          >
            {{ $t('bookings.newBooking') }}
          </v-btn>
        </v-col>
      </v-row>
    </BaseCard>

    <BaseCard v-if="filteredBookings.length > 0">
      <v-data-table
        :items="filteredBookings"
        :headers="headers"
        :items-per-page="10"
        hover
      >
        <template v-slot:item.resourceId="{ item }">
          {{ getResourceName(item.resourceId) }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small">
            {{ $t(`bookings.statuses.${item.status}`) }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.status === 'pending'"
            icon="mdi-check"
            size="small"
            variant="text"
            color="success"
            @click="updateStatus(item.id, 'confirmed')"
            :title="$t('bookings.confirm')"
          />
          <v-btn
            v-if="item.status === 'pending'"
            icon="mdi-close"
            size="small"
            variant="text"
            color="error"
            @click="updateStatus(item.id, 'rejected')"
            :title="$t('bookings.reject')"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
            :title="$t('bookings.delete')"
          />
        </template>
      </v-data-table>
    </BaseCard>

    <BaseCard v-else class="pa-8 text-center">
      <v-icon size="64" color="grey">mdi-book-open-outline</v-icon>
      <p class="text-h6 text-grey mt-4">{{ $t('bookings.empty') }}</p>
      <v-btn color="primary" :to="{ name: 'new-booking' }" class="mt-4">
        {{ $t('bookings.createFirst') }}
      </v-btn>
    </BaseCard>

    <ConfirmDialog
      v-model="deleteDialog"
      @confirm="handleDelete"
      @cancel="deleteDialog = false"
    >
      <template #title>{{ $t('bookings.deleteConfirm') }}</template>
      <template #confirmText>{{ $t('common.delete') }}</template>
      <template #cancelText>{{ $t('common.cancel') }}</template>
    </ConfirmDialog>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import BasePage from '../components/BasePage.vue'
import BaseCard from '../components/BaseCard.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const { t } = useI18n()
const store = useStore()

const filterStatus = ref(null)
const filterResource = ref(null)
const filterDate = ref('')

const statusOptions = [
  { title: t('bookings.statuses.pending'), value: 'pending' },
  { title: t('bookings.statuses.confirmed'), value: 'confirmed' },
  { title: t('bookings.statuses.rejected'), value: 'rejected' }
]

const headers = computed(() => [
  { title: t('bookings.table.resource'), key: 'resourceId' },
  { title: t('bookings.table.title'), key: 'title' },
  { title: t('bookings.table.date'), key: 'date' },
  { title: t('bookings.table.startTime'), key: 'startTime' },
  { title: t('bookings.table.endTime'), key: 'endTime' },
  { title: t('bookings.table.status'), key: 'status' },
  { title: t('bookings.table.participants'), key: 'participants' },
  { title: t('bookings.table.createdBy'), key: 'createdBy' },
  { title: t('bookings.table.actions'), key: 'actions', sortable: false }
])

const resourceOptions = computed(() =>
  store.getters.allResources.map(r => ({ title: r.name, value: r.id }))
)

const getResourceName = (id) => {
  const resource = store.getters.allResources.find(r => r.id === id)
  return resource ? resource.name : 'Неизвестно'
}

const getStatusColor = (status) => {
  return { confirmed: 'success', pending: 'warning', rejected: 'error' }[status] || 'grey'
}

const filteredBookings = computed(() => {
  let bookings = store.getters.allBookings
  if (filterStatus.value) bookings = bookings.filter(b => b.status === filterStatus.value)
  if (filterResource.value) bookings = bookings.filter(b => b.resourceId === filterResource.value)
  if (filterDate.value) bookings = bookings.filter(b => b.date === filterDate.value)
  return bookings
})

const updateStatus = (id, status) => {
  store.dispatch('updateBookingStatus', { id, status })
}

const deleteDialog = ref(false)
const deleteTarget = ref(null)

const confirmDelete = (booking) => {
  deleteTarget.value = booking
  deleteDialog.value = true
}

const handleDelete = () => {
  store.dispatch('deleteBooking', deleteTarget.value.id)
  deleteDialog.value = false
  deleteTarget.value = null
}

onMounted(() => {
  store.dispatch('loadData')
})
</script>
