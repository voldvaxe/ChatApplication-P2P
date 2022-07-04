import { createStore } from "vuex";

export default createStore({
  state: {
    token: "",
    info: {},
    emails: [],
  },
  getters: {},
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setInfo(state, info) {
      state.info = info;
    },
    setEmails(state, emails) {
      state.emails = emails;
    },
  },
  actions: {},
  modules: {},
});
