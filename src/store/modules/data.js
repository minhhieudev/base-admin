
export default {
  state: {
    users: {
      docs: [],
      total: 0
    },
    tasks: {
      docs: [],
      total: 0
    },
    epics: {
      docs: [],
      total: 0
    },
    sprints: {
      docs: [],
      total: 0
    },
    answers: {
      docs: [],
      total: 0
    },
    questions: {
      docs: [],
      total: 0
    },

    allEpics: [],
    allSprints: [],
    allUsers: [],
  },
  mutations: {
    SET_DATA: function(state, payload) {
      state[payload.key] = payload.data
    },
  },
  actions: {
    setData: function({ commit }, payload) {
      commit('SET_DATA', payload)
    }
  }
}
