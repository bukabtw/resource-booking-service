import { createStore } from 'vuex'

const RESOURCES_KEY = 'booking-resources'
const BOOKINGS_KEY = 'booking-bookings'

const DEMO_RESOURCES = [
  { id: 1, name: 'Конференц-зал А', type: 'room', capacity: 20, responsible: 'Иван Петров', status: 'active' },
  { id: 2, name: 'Конференц-зал B', type: 'room', capacity: 10, responsible: 'Анна Смирнова', status: 'active' },
  { id: 3, name: 'Переговорная С', type: 'room', capacity: 6, responsible: 'Анна Смирнова', status: 'active' },
  { id: 4, name: 'Фотограф Дмитрий', type: 'person', capacity: 1, responsible: 'Дмитрий Козлов', status: 'active' },
  { id: 5, name: 'Видеограф Мария', type: 'person', capacity: 1, responsible: 'Мария Иванова', status: 'active' },
  { id: 6, name: 'Проектор Epson', type: 'equipment', capacity: 1, responsible: 'Сергей Иванов', status: 'active' },
  { id: 7, name: 'Ноутбук для презентаций', type: 'equipment', capacity: 1, responsible: 'Сергей Иванов', status: 'inactive' },
  { id: 8, name: 'Флипчарт', type: 'equipment', capacity: 1, responsible: 'Ольга Соколова', status: 'active' }
]

const DEMO_BOOKINGS = [
  { id: 1, resourceId: 1, title: 'Встреча отдела продаж', date: '2026-05-15', startTime: '10:00', endTime: '12:00', participants: 'ivan@mail.ru, anna@mail.ru', status: 'confirmed', createdBy: 'Кирилл Букарев', createdAt: '2026-05-10' },
  { id: 2, resourceId: 4, title: 'Фотосессия для маркетинга', date: '2026-05-16', startTime: '14:00', endTime: '16:00', participants: 'dmitry@mail.ru', status: 'pending', createdBy: 'Анна Смирнова', createdAt: '2026-05-11' },
  { id: 3, resourceId: 1, title: 'Совещание руководства', date: '2026-05-15', startTime: '14:00', endTime: '16:00', participants: 'boss@mail.ru', status: 'confirmed', createdBy: 'Кирилл Букарев', createdAt: '2026-05-10' },
  { id: 4, resourceId: 6, title: 'Презентация проекта', date: '2026-05-17', startTime: '11:00', endTime: '13:00', participants: 'team@mail.ru', status: 'pending', createdBy: 'Сергей Иванов', createdAt: '2026-05-12' }
]

export default createStore({
  state: {
    resources: [],
    bookings: [],
    notification: { message: '', type: 'info', visible: false },
    nextResourceId: 9,
    nextBookingId: 5
  },
  mutations: {
    LOAD_FROM_STORAGE(state) {
      let savedResources = localStorage.getItem(RESOURCES_KEY)
      let savedBookings = localStorage.getItem(BOOKINGS_KEY)

      if (!savedResources) {
        state.resources = [...DEMO_RESOURCES]
        localStorage.setItem(RESOURCES_KEY, JSON.stringify(state.resources))
      } else {
        state.resources = JSON.parse(savedResources)
      }

      if (!savedBookings) {
        state.bookings = [...DEMO_BOOKINGS]
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(state.bookings))
      } else {
        state.bookings = JSON.parse(savedBookings)
      }

      if (state.resources.length > 0) {
        state.nextResourceId = Math.max(...state.resources.map(r => r.id)) + 1
      }
      if (state.bookings.length > 0) {
        state.nextBookingId = Math.max(...state.bookings.map(b => b.id)) + 1
      }
    },

    ADD_RESOURCE(state, resource) {
      resource.id = state.nextResourceId++
      resource.status = 'active'
      state.resources.push(resource)
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(state.resources))
    },
    UPDATE_RESOURCE(state, updatedResource) {
      const index = state.resources.findIndex(r => r.id === updatedResource.id)
      if (index !== -1) {
        state.resources[index] = { ...state.resources[index], ...updatedResource }
        localStorage.setItem(RESOURCES_KEY, JSON.stringify(state.resources))
      }
    },
    DELETE_RESOURCE(state, id) {
      state.resources = state.resources.filter(r => r.id !== id)
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(state.resources))
    },

    ADD_BOOKING(state, booking) {
      booking.id = state.nextBookingId++
      state.bookings.push(booking)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(state.bookings))
    },
    UPDATE_BOOKING_STATUS(state, { id, status }) {
      const booking = state.bookings.find(b => b.id === id)
      if (booking) {
        booking.status = status
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(state.bookings))
      }
    },
    DELETE_BOOKING(state, id) {
      state.bookings = state.bookings.filter(b => b.id !== id)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(state.bookings))
    },

    // Уведомления
    SHOW_NOTIFICATION(state, { message, type }) {
      state.notification = { message, type, visible: true }
    },
    HIDE_NOTIFICATION(state) {
      state.notification.visible = false
    }
  },
  actions: {
    loadData({ commit }) {
      commit('LOAD_FROM_STORAGE')
    },

    addResource({ commit }, resource) {
      commit('ADD_RESOURCE', resource)
      commit('SHOW_NOTIFICATION', { message: 'Ресурс добавлен', type: 'success' })
    },
    updateResource({ commit }, resource) {
      commit('UPDATE_RESOURCE', resource)
      commit('SHOW_NOTIFICATION', { message: 'Ресурс обновлён', type: 'success' })
    },
    deleteResource({ commit, state }, id) {
      const hasBookings = state.bookings.some(b => b.resourceId === id)
      if (hasBookings) {
        commit('SHOW_NOTIFICATION', { message: 'Нельзя удалить ресурс с активными бронированиями', type: 'error' })
        return
      }
      commit('DELETE_RESOURCE', id)
      commit('SHOW_NOTIFICATION', { message: 'Ресурс удалён', type: 'success' })
    },

    addBooking({ commit, state }, booking) {
      const conflict = state.bookings.some(b => 
        b.resourceId === booking.resourceId && 
        b.date === booking.date &&
        b.status !== 'rejected' &&
        ((booking.startTime >= b.startTime && booking.startTime < b.endTime) ||
        (booking.endTime > b.startTime && booking.endTime <= b.endTime) ||
        (booking.startTime <= b.startTime && booking.endTime >= b.endTime))
      )
      if (conflict) {
        commit('SHOW_NOTIFICATION', { message: 'Конфликт! Ресурс уже занят в это время', type: 'error' })
        return false
      }
      commit('ADD_BOOKING', { ...booking, status: 'pending', createdAt: new Date().toISOString().split('T')[0] })
      commit('SHOW_NOTIFICATION', { message: 'Бронирование создано', type: 'success' })
      return true
    },
    updateBookingStatus({ commit }, { id, status }) {
      commit('UPDATE_BOOKING_STATUS', { id, status })
      const statusText = { confirmed: 'подтверждено', pending: 'ожидает', rejected: 'отклонено' }
      commit('SHOW_NOTIFICATION', { message: `Бронирование ${statusText[status] || status}`, type: status === 'rejected' ? 'error' : 'success' })
    },
    deleteBooking({ commit }, id) {
      commit('DELETE_BOOKING', id)
      commit('SHOW_NOTIFICATION', { message: 'Бронирование удалено', type: 'success' })
    },

    showNotification({ commit }, payload) {
      commit('SHOW_NOTIFICATION', payload)
    },
    hideNotification({ commit }) {
      commit('HIDE_NOTIFICATION')
    }
  },
  getters: {
    allResources: state => state.resources,
    activeResources: state => state.resources.filter(r => r.status === 'active'),
    resourcesByType: state => type => state.resources.filter(r => r.type === type),
    getResourceById: state => id => state.resources.find(r => r.id === id),
    allBookings: state => state.bookings,
    bookingsByDate: state => date => state.bookings.filter(b => b.date === date),
    bookingsByResource: state => resourceId => state.bookings.filter(b => b.resourceId === resourceId),
    pendingBookings: state => state.bookings.filter(b => b.status === 'pending'),
    confirmedBookings: state => state.bookings.filter(b => b.status === 'confirmed'),
    totalResources: state => state.resources.length,
    activeResourcesCount: (state, getters) => getters.activeResources.length,
    totalBookings: state => state.bookings.length,
    pendingCount: (state, getters) => getters.pendingBookings.length,
    notification: state => state.notification,

    bookingsForCalendar: state => (date, resourceId) => {
      return state.bookings.filter(b => 
        b.date === date && b.resourceId === resourceId && b.status !== 'rejected'
      )
    },

    bookingsByStatus: state => {
      return {
        confirmed: state.bookings.filter(b => b.status === 'confirmed').length,
        pending: state.bookings.filter(b => b.status === 'pending').length,
        rejected: state.bookings.filter(b => b.status === 'rejected').length
      }
    },
    popularResources: state => {
      const counts = {}
      state.bookings.forEach(b => {
        counts[b.resourceId] = (counts[b.resourceId] || 0) + 1
      })
      return Object.entries(counts)
        .map(([resourceId, count]) => ({
          resource: state.resources.find(r => r.id === parseInt(resourceId)),
          count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }
  }
})
