<template>
  <BasePage>
    <template #header>{{ $t('app.calendar') }}</template>
    <v-snackbar v-model="store.state.notification.visible" :color="store.state.notification.type" timeout="3000" location="top right">
      {{ store.state.notification.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="store.dispatch('hideNotification')">✕</v-btn>
      </template>
    </v-snackbar>
    <BaseCard>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-btn icon="mdi-chevron-left" variant="text" @click="prevWeek" />
        </v-col>
        <v-col cols="auto">
          <span class="text-h6">{{ weekRange }}</span>
        </v-col>
        <v-col cols="auto">
          <v-btn icon="mdi-chevron-right" variant="text" @click="nextWeek" />
        </v-col>
        <v-col cols="auto">
          <v-btn variant="outlined" size="small" @click="currentWeek">Сегодня</v-btn>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'new-booking' }">
            {{ $t('bookings.newBooking') }}
          </v-btn>
        </v-col>
      </v-row>
    </BaseCard>
    <BaseCard class="d-flex justify-center ga-6">
      <v-chip color="success" size="small" label>{{ $t('calendar.legend.confirmed') }}</v-chip>
      <v-chip color="warning" size="small" label>{{ $t('calendar.legend.pending') }}</v-chip>
      <v-chip color="grey-lighten-1" size="small" label>{{ $t('calendar.legend.free') }}</v-chip>
    </BaseCard>
    <BaseCard>
      <div class="calendar-grid">
        <div class="calendar-row header-row">
          <div class="calendar-cell resource-header">{{ $t('calendar.resource') }}</div>
          <div 
            v-for="day in weekDays" 
            :key="day.date" 
            class="calendar-cell day-header"
            :class="{ 'today': day.isToday }"
          >
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.dateFormatted }}</div>
          </div>
        </div>
        <div 
          v-for="resource in activeResources" 
          :key="resource.id" 
          class="calendar-row"
        >
          <div class="calendar-cell resource-cell">
            <div class="resource-name">{{ resource.name }}</div>
            <div class="resource-type">{{ $t(`resources.types.${resource.type}`) }}</div>
          </div>
          <div 
            v-for="day in weekDays" 
            :key="`${resource.id}-${day.date}`" 
            class="calendar-cell day-cell"
            @click="openSlot(resource, day.date)"
          >
            <div 
              v-for="booking in getBookingsForDay(resource.id, day.date)" 
              :key="booking.id"
              class="booking-block"
              :class="`status-${booking.status}`"
              @click.stop="showBookingDetails(booking)"
            >
              <div class="booking-time">{{ booking.startTime }}-{{ booking.endTime }}</div>
              <div class="booking-title">{{ booking.title }}</div>
            </div>
            <div v-if="getBookingsForDay(resource.id, day.date).length === 0" class="free-slot">
              {{ $t('calendar.free') }}
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
    <BaseCard v-if="activeResources.length === 0" class="pa-8 text-center">
      <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
      <p class="text-h6 text-grey mt-4">{{ $t('calendar.noResources') }}</p>
      <v-btn color="primary" to="/resources" class="mt-4">{{ $t('calendar.goToResources') }}</v-btn>
    </BaseCard>
    <v-dialog v-model="detailsDialog" max-width="500">
      <v-card v-if="selectedBooking">
        <v-card-title>{{ selectedBooking.title }}</v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend><v-icon>mdi-folder</v-icon></template>
              <v-list-item-title>{{ getResourceName(selectedBooking.resourceId) }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend><v-icon>mdi-calendar</v-icon></template>
              <v-list-item-title>{{ selectedBooking.date }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend><v-icon>mdi-clock-outline</v-icon></template>
              <v-list-item-title>{{ selectedBooking.startTime }} — {{ selectedBooking.endTime }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend><v-icon>mdi-account-multiple</v-icon></template>
              <v-list-item-title>{{ selectedBooking.participants || $t('calendar.noParticipants') }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-chip :color="getStatusColor(selectedBooking.status)" size="x-small" class="mr-2">
                  {{ $t(`bookings.statuses.${selectedBooking.status}`) }}
                </v-chip>
              </template>
              <v-list-item-title>{{ $t(`bookings.statuses.${selectedBooking.status}`) }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend><v-icon>mdi-account</v-icon></template>
              <v-list-item-title>{{ selectedBooking.createdBy }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="selectedBooking.status === 'pending'" color="success" @click="updateStatus(selectedBooking.id, 'confirmed')">
            {{ $t('bookings.confirm') }}
          </v-btn>
          <v-btn v-if="selectedBooking.status === 'pending'" color="error" @click="updateStatus(selectedBooking.id, 'rejected')">
            {{ $t('bookings.reject') }}
          </v-btn>
          <v-btn variant="text" @click="detailsDialog = false">{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import BasePage from '../components/BasePage.vue'
import BaseCard from '../components/BaseCard.vue'

const store = useStore()
const { t, locale } = useI18n()

const weekOffset = ref(0)

const getMonday = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const monday = computed(() => {
  const now = new Date()
  const m = getMonday(now)
  m.setDate(m.getDate() + weekOffset.value * 7)
  return m
})

const weekDays = computed(() => {
  const days = []
  const dayNames = locale.value === 'ru' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(monday.value)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      name: dayNames[i],
      dateFormatted: date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }),
      isToday: date.getTime() === today.getTime()
    })
  }
  return days
})

const weekRange = computed(() => {
  const start = weekDays.value[0]?.date || ''
  const end = weekDays.value[4]?.date || ''
  return `${start} — ${end}`
})

const prevWeek = () => weekOffset.value--
const nextWeek = () => weekOffset.value++
const currentWeek = () => weekOffset.value = 0

const activeResources = computed(() => store.getters.activeResources)

const getBookingsForDay = (resourceId, date) => {
  return store.getters.allBookings.filter(b => 
    b.resourceId === resourceId && b.date === date && b.status !== 'rejected'
  )
}

const openSlot = (resource, date) => {
}

const detailsDialog = ref(false)
const selectedBooking = ref(null)

const showBookingDetails = (booking) => {
  selectedBooking.value = booking
  detailsDialog.value = true
}

const getResourceName = (id) => {
  const r = store.getters.allResources.find(r => r.id === id)
  return r ? r.name : ''
}

const getStatusColor = (status) => {
  return { confirmed: 'success', pending: 'warning', rejected: 'error' }[status] || 'grey'
}

const updateStatus = (id, status) => {
  store.dispatch('updateBookingStatus', { id, status })
  detailsDialog.value = false
}

onMounted(() => {
  store.dispatch('loadData')
})
</script>

<style scoped>
.calendar-grid {
  overflow-x: auto;
}

.calendar-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  min-height: 80px;
}

.header-row {
  background: #f5f5f5;
  font-weight: bold;
  min-height: 60px;
}

.calendar-cell {
  flex: 1;
  min-width: 120px;
  padding: 8px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.resource-header, .resource-cell {
  flex: 0 0 180px;
  min-width: 180px;
  background: #fafafa;
  justify-content: center;
}

.day-header {
  text-align: center;
  justify-content: center;
  align-items: center;
}

.day-header.today {
  background: #e3f2fd;
}

.day-name {
  font-size: 0.8rem;
  color: #666;
}

.day-date {
  font-size: 1.1rem;
  font-weight: bold;
}

.day-cell {
  cursor: pointer;
  transition: background 0.2s;
  gap: 4px;
}

.day-cell:hover {
  background: #f5f5f5;
}

.booking-block {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: transform 0.1s;
}

.booking-block:hover {
  transform: scale(1.02);
}

.booking-block.status-confirmed {
  background: #c8e6c9;
  border-left: 3px solid #4caf50;
}

.booking-block.status-pending {
  background: #ffe0b2;
  border-left: 3px solid #ff9800;
}

.booking-time {
  font-weight: bold;
  font-size: 0.7rem;
}

.booking-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.free-slot {
  color: #ccc;
  font-size: 0.8rem;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-name {
  font-weight: 500;
}

.resource-type {
  font-size: 0.75rem;
  color: #888;
}
</style>
