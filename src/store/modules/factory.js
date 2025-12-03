import { facSearch } from '@/api/options'

const factory = {
  state: {
    facList: JSON.parse(localStorage.getItem('facList')) || [],
    isFacList: localStorage.getItem('isFacList') || '0'
  },

  mutations: {
    SET_FAC_LIST: (state, list) => {
      state.facList = list
      state.isFacList = '1'
      localStorage.setItem('facList', JSON.stringify(list))
      localStorage.setItem('isFacList', '1')
    },
    DEL_FAC_LIST: (state) => {
      state.facList = []
      state.isFacList = '0'
      localStorage.setItem('facList', JSON.stringify([]))
      localStorage.setItem('isFacList', '0')
    }
  },

  actions: {
    getFacList ({ commit, state }) {
      if (state.isFacList === '0') {
        facSearch().then((res) => {
          if (res.code === '0') {
            commit('SET_FAC_LIST', res.data)
          } else {
            commit('SET_FAC_LIST', [])
          }
        })
      }
    },
    removeFacList ({ commit }) {
      commit('DEL_FAC_LIST')
    }
  }
}

export default factory
