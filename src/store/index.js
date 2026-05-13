import { createStore } from 'vuex'

export default createStore({
  state: {
    resources: [],
    bookings: [],
    notification: { message: '', type: 'info', visible: false }
  },
  mutations: {
    LOAD_FROM_STORAGE(state) {
      const savedResources = localStorage.getItem('booking-resources')
      const savedBookings = localStorage.getItem('booking-bookings')
      if (savedResources) state.resources = JSON.parse(savedResources)
      if (savedBookings) state.bookings = JSON.parse(savedBookings)
    },
    SAVE_RESOURCES(state) {
      localStorage.setItem('booking-resources', JSON.stringify(state.resources))
    },
    SAVE_BOOKINGS(state) {
      localStorage.setItem('booking-bookings', JSON.stringify(state.bookings))
    },
    SHOW_NOTIFICATION(state, { message, type }) {
      state.notification = { message, type, visible: true }
    },
    HIDE_NOTIFICATION(state) {
      state.notification.visible = false
    }
  },
  actions: {
    loadFromStorage({ commit }) { commit('LOAD_FROM_STORAGE') },
    showNotification({ commit }, payload) { commit('SHOW_NOTIFICATION', payload) },
    hideNotification({ commit }) { commit('HIDE_NOTIFICATION') }
  },
  getters: {
    allResources: state => state.resources,
    activeResources: state => state.resources.filter(r => r.status === 'active'),
    allBookings: state => state.bookings,
    notification: state => state.notification
  }
})
