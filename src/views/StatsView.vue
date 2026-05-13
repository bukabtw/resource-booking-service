<template>
  <BasePage>
    <template #header>{{ $t('app.stats') }}</template>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <BaseStatCard color="primary" icon="mdi-folder" :value="store.getters.totalResources">
          <template #label>{{ $t('stats.totalResources') }}</template>
        </BaseStatCard>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <BaseStatCard color="success" icon="mdi-check-circle" :value="store.getters.activeResourcesCount">
          <template #label>{{ $t('stats.activeResources') }}</template>
        </BaseStatCard>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <BaseStatCard color="info" icon="mdi-book-open" :value="store.getters.totalBookings">
          <template #label>{{ $t('stats.totalBookings') }}</template>
        </BaseStatCard>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <BaseStatCard color="warning" icon="mdi-clock-outline" :value="store.getters.pendingCount">
          <template #label>{{ $t('stats.pendingBookings') }}</template>
        </BaseStatCard>
      </v-col>
    </v-row>
    <BaseCard :title="$t('stats.bookingStatuses')">
      <v-row>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <div class="text-h3 text-success">{{ statusCounts.confirmed }}</div>
            <div class="text-subtitle-1">{{ $t('bookings.statuses.confirmed') }}</div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <div class="text-h3 text-warning">{{ statusCounts.pending }}</div>
            <div class="text-subtitle-1">{{ $t('bookings.statuses.pending') }}</div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <div class="text-h3 text-error">{{ statusCounts.rejected }}</div>
            <div class="text-subtitle-1">{{ $t('bookings.statuses.rejected') }}</div>
          </div>
        </v-col>
      </v-row>
    </BaseCard>
    <BaseCard :title="$t('stats.confirmationRate')">
      <v-progress-linear
        :model-value="confirmationRate"
        color="success"
        height="25"
        rounded
        class="mt-2"
      >
        <template v-slot:default>
          <span class="text-white">{{ confirmationRate }}%</span>
        </template>
      </v-progress-linear>
      <p class="text-grey mt-2">{{ $t('stats.confirmationRateDesc') }}</p>
    </BaseCard>
    <BaseCard :title="$t('stats.popularResources')">
      <v-list v-if="popularResources.length > 0">
        <v-list-item v-for="(item, index) in popularResources" :key="item.resource?.id">
          <template v-slot:prepend>
            <v-avatar :color="getRankColor(index)" size="36">
              <span class="text-white">#{{ index + 1 }}</span>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.resource?.name || 'Неизвестно' }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.count }} {{ getBookingWord(item.count) }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-chip :color="getRankColor(index)" size="small" label>{{ item.count }}</v-chip>
          </template>
        </v-list-item>
      </v-list>
      <p v-else class="text-grey text-center pa-4">{{ $t('stats.noData') }}</p>
    </BaseCard>
    <BaseCard :title="$t('stats.resourcesByType')">
      <v-row>
        <v-col cols="12" sm="4" v-for="type in resourceTypes" :key="type.value">
          <v-card :color="type.color" class="text-white text-center pa-4" variant="tonal">
            <v-icon size="40">{{ type.icon }}</v-icon>
            <div class="text-h5 mt-2">{{ getTypeCount(type.value) }}</div>
            <div>{{ $t(`resources.types.${type.value}`) }}</div>
          </v-card>
        </v-col>
      </v-row>
    </BaseCard>
    <BaseCard :title="$t('stats.bookingsByDay')">
      <v-table v-if="totalBookings > 0">
        <thead>
          <tr>
            <th v-for="day in weekDays" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(count, day) in bookingsByWeekday" :key="day" class="text-center">
              <v-chip :color="count > 0 ? 'primary' : 'grey'" size="small" label>{{ count }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-else class="text-grey text-center pa-4">{{ $t('stats.noData') }}</p>
    </BaseCard>
  </BasePage>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import BasePage from '../components/BasePage.vue'
import BaseCard from '../components/BaseCard.vue'
import BaseStatCard from '../components/BaseStatCard.vue'

const store = useStore()
const { t, locale } = useI18n()

const statusCounts = computed(() => store.getters.bookingsByStatus)

const confirmationRate = computed(() => {
  const total = store.getters.totalBookings
  if (total === 0) return 0
  return Math.round((statusCounts.value.confirmed / total) * 100)
})

const popularResources = computed(() => store.getters.popularResources)

const getRankColor = (index) => {
  return ['#FFD700', '#C0C0C0', '#CD7F32'][index] || 'primary'
}

const getBookingWord = (count) => {
  if (locale.value === 'ru') {
    if (count % 10 === 1 && count % 100 !== 11) return 'бронирование'
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'бронирования'
    return 'бронирований'
  }
  return count === 1 ? 'booking' : 'bookings'
}

const resourceTypes = [
  { value: 'room', icon: 'mdi-door', color: 'primary' },
  { value: 'person', icon: 'mdi-account', color: 'warning' },
  { value: 'equipment', icon: 'mdi-monitor', color: 'info' }
]

const getTypeCount = (type) => {
  return store.getters.allResources.filter(r => r.type === type).length
}

const weekDays = computed(() => 
  locale.value === 'ru' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
)

const bookingsByWeekday = computed(() => {
  const counts = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }
  store.getters.allBookings.forEach(b => {
    const date = new Date(b.date)
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const day = days[date.getDay()]
    counts[day]++
  })
  return counts
})

const totalBookings = computed(() => store.getters.totalBookings)
</script>
