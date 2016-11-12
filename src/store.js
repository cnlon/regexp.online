import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  charRect: null,
}

const mutations = {
  setCharRect (state, charRect) {
    state.charRect = charRect
  },
}

export default new Vuex.Store({
  /* eslint-disable no-undef */
  strict: process.env.NODE_ENV === 'development',
  /* eslint-enable no-undef */
  state,
  mutations,
})
