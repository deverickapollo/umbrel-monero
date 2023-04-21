import API from "@/helpers/api";

// Initial state
const state = () => ({
  moneroConfig: {},
});

// Functions to update the state directly
const mutations = {
  setMoneroConfig(state, moneroConfig) {
    state.moneroConfig = moneroConfig;
  },
};

const actions = {
  async getMoneroConfig({ commit }) {
    const existingConfig = await API.get(
      `${import.meta.env.VITE_APP_API_BASE_URL}/v1/monerod/system/monero-config`
    );

    if (existingConfig) {
      commit("setMoneroConfig", existingConfig);
    }
  },
  updateMoneroConfig({ commit }, moneroConfig) {
    commit("setMoneroConfig", moneroConfig);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
