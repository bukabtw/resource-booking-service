<template>
  <BasePage>
    <template #header>{{ $t('bookings.newBooking') }}</template>

    <!-- Уведомление -->
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
      <v-form @submit.prevent="submitBooking">
        <v-select
          v-model="form.resourceId"
          :items="resourceItems"
          :label="$t('bookings.form.resource')"
          variant="outlined"
          class="mb-3"
          :rules="[v => !!v || 'Выберите ресурс']"
          required
        />
        <v-text-field
          v-model="form.title"
          :label="$t('bookings.form.title')"
          variant="outlined"
          class="mb-3"
          :rules="[v => !!v || 'Введите название']"
          required
        />
        <v-row>
          <v-col cols="12" sm="4">
            <v-date-input
              v-model="form.date"
              :label="$t('bookings.form.date')"
              variant="outlined"
              class="mb-3"
              :min="today"
              :rules="[v => !!v || 'Выберите дату']"
              required
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="form.startTime"
              :label="$t('bookings.form.startTime')"
              type="time"
              variant="outlined"
              class="mb-3"
              :rules="[v => !!v || 'Выберите время начала']"
              required
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="form.endTime"
              :label="$t('bookings.form.endTime')"
              type="time"
              variant="outlined"
              class="mb-3"
              :rules="[
                v => !!v || 'Выберите время окончания',
                v => !form.startTime || v > form.startTime || 'Время конца должно быть позже начала'
              ]"
              required
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="form.participants"
          :label="$t('bookings.form.participants')"
          variant="outlined"
          class="mb-3"
          placeholder="email1@mail.ru, email2@mail.ru"
          hint="Введите email через запятую"
          persistent-hint
        />
        <div class="text-right">
          <v-btn
            variant="outlined"
            class="mr-2"
            :to="{ name: 'bookings' }"
          >
            {{ $t('bookings.form.cancel') }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="!isFormValid"
            :loading="submitting"
          >
            {{ $t('bookings.form.submit') }}
          </v-btn>
        </div>
      </v-form>
    </BaseCard>

    <!-- Информация о выбранном ресурсе -->
    <BaseCard v-if="selectedResource" :title="$t('bookings.form.resourceInfo')">
      <v-list density="compact">
        <v-list-item>
          <template v-slot:prepend><v-icon>mdi-folder</v-icon></template>
          <v-list-item-title>{{ selectedResource.name }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend><v-icon>mdi-account</v-icon></template>
          <v-list-item-title>{{ selectedResource.responsible }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend><v-icon>mdi-account-group</v-icon></template>
          <v-list-item-title>Вместимость: {{ selectedResource.capacity }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </BaseCard>

    <!-- Существующие бронирования на эту дату -->
    <BaseCard
      v-if="form.date && form.resourceId"
      :title="$t('bookings.form.existingBookings')"
    >
      <v-list
        v-if="existingBookings.length > 0"
        density="compact"
      >
        <v-list-item v-for="b in existingBookings" :key="b.id">
          <template v-slot:prepend>
            <v-chip :color="getStatusColor(b.status)" size="x-small" class="mr-2">
              {{ b.status }}
            </v-chip>
          </template>
          <v-list-item-title>
            {{ b.startTime }}-{{ b.endTime }} — {{ b.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <p v-else class="text-grey">На эту дату бронирований нет</p>
    </BaseCard>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BasePage from '../components/BasePage.vue'
import BaseCard from '../components/BaseCard.vue'

const router = useRouter()
const store = useStore()

const submitting = ref(false)
const today = new Date().toISOString().split('T')[0]

const form = ref({
  resourceId: null,
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  participants: ''
})

const resourceItems = computed(() =>
  store.getters.activeResources.map(r => ({ title: r.name, value: r.id }))
)

const selectedResource = computed(() =>
  store.getters.allResources.find(r => r.id === form.value.resourceId)
)

const existingBookings = computed(() => {
  if (!form.value.date || !form.value.resourceId) return []
  return store.getters.bookingsByDate(form.value.date)
    .filter(b => b.resourceId === form.value.resourceId && b.status !== 'rejected')
})

const isFormValid = computed(() =>
  form.value.resourceId &&
  form.value.title &&
  form.value.date &&
  form.value.startTime &&
  form.value.endTime &&
  form.value.endTime > form.value.startTime
)

const getStatusColor = (status) => {
  return { confirmed: 'success', pending: 'warning', rejected: 'error' }[status] || 'grey'
}

const submitBooking = async () => {
  if (!isFormValid.value) return
  submitting.value = true
  const success = await store.dispatch('addBooking', {
    ...form.value,
    createdBy: 'Пользователь'
  })
  if (success) {
    setTimeout(() => router.push({ name: 'bookings' }), 500)
  }
  submitting.value = false
}

onMounted(() => {
  store.dispatch('loadData')
})
</script>
