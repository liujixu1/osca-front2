// Pathify
import { make } from "vuex-pathify";

// Data
const state = {
  msg: "",
  color: "",
  visible: false,
  showClose: true,
  timeout: 5000
};

const mutations = make.mutations(state);

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
