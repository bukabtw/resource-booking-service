import { createStore } from 'vuex'

const API_BASE = '/api'

async function api(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || 'Ошибка запроса')
  }
  return data
}

export default createStore({
  state: {
    resources: [],
    bookings: [],
    notification: { message: '', type: 'info', visible: false },
  },
  mutations: {
    SET_RESOURCES(state, resources) {
      state.resources = resources
    },
    SET_BOOKINGS(state, bookings) {
      state.bookings = bookings
    },
    ADD_RESOURCE(state, resource) {
      state.resources.push(resource)
    },
    UPDATE_RESOURCE(state, updatedResource) {
      const index = state.resources.findIndex(r => r.id === updatedResource.id)
      if (index !== -1) {
        state.resources[index] = { ...state.resources[index], ...updatedResource }
      }
    },
    DELETE_RESOURCE(state, id) {
      state.resources = state.resources.filter(r => r.id !== id)
    },
    ADD_BOOKING(state, booking) {
      state.bookings.push(booking)
    },
    UPDATE_BOOKING(state, updatedBooking) {
      const index = state.bookings.findIndex(b => b.id === updatedBooking.id)
      if (index !== -1) {
        state.bookings[index] = { ...state.bookings[index], ...updatedBooking }
      }
    },
    DELETE_BOOKING(state, id) {
      state.bookings = state.bookings.filter(b => b.id !== id)
    },
    SHOW_NOTIFICATION(state, { message, type }) {
      state.notification = { message, type, visible: true }
    },
    HIDE_NOTIFICATION(state) {
      state.notification.visible = false
    },
  },
  actions: {
    async loadData({ commit, dispatch }) {
      try {
        const [resources, bookings] = await Promise.all([
          api('/resources'),
          api('/bookings'),
        ])
        commit('SET_RESOURCES', resources)
        commit('SET_BOOKINGS', bookings)
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
      }
    },

    async addResource({ commit }, resource) {
      try {
        const created = await api('/resources', {
          method: 'POST',
          body: JSON.stringify(resource),
        })
        commit('ADD_RESOURCE', created)
        commit('SHOW_NOTIFICATION', { message: 'Ресурс добавлен', type: 'success' })
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
      }
    },
    async updateResource({ commit }, resource) {
      try {
        const updated = await api(`/resources/${resource.id}`, {
          method: 'PUT',
          body: JSON.stringify(resource),
        })
        commit('UPDATE_RESOURCE', updated)
        commit('SHOW_NOTIFICATION', { message: 'Ресурс обновлён', type: 'success' })
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
      }
    },
    async deleteResource({ commit, state }, id) {
      try {
        await api(`/resources/${id}`, { method: 'DELETE' })
        commit('DELETE_RESOURCE', id)
        commit('SHOW_NOTIFICATION', { message: 'Ресурс удалён', type: 'success' })
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
      }
    },

    async addBooking({ commit }, booking) {
      try {
        const created = await api('/bookings', {
          method: 'POST',
          body: JSON.stringify(booking),
        })
        commit('ADD_BOOKING', created)
        commit('SHOW_NOTIFICATION', { message: 'Бронирование создано', type: 'success' })
        return true
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
        return false
      }
    },
    async updateBookingStatus({ commit }, { id, status }) {
      try {
        const updated = await api(`/bookings/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        })
        commit('UPDATE_BOOKING', updated)
        const statusText = { confirmed: 'подтверждено', pending: 'ожидает', rejected: 'отклонено' }
        commit('SHOW_NOTIFICATION', {
          message: `Бронирование ${statusText[status] || status}`,
          type: status === 'rejected' ? 'error' : 'success',
        })
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
      }
    },
    async deleteBooking({ commit }, id) {
      try {
        await api(`/bookings/${id}`, { method: 'DELETE' })
        commit('DELETE_BOOKING', id)
        commit('SHOW_NOTIFICATION', { message: 'Бронирование удалено', type: 'success' })
      } catch (e) {
        commit('SHOW_NOTIFICATION', { message: e.message, type: 'error' })
      }
    },

    showNotification({ commit }, payload) {
      commit('SHOW_NOTIFICATION', payload)
    },
    hideNotification({ commit }) {
      commit('HIDE_NOTIFICATION')
    },
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
        rejected: state.bookings.filter(b => b.status === 'rejected').length,
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
    },
  },
})