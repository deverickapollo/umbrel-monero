import API from "@/helpers/api";

// Initial state
const state = () => ({
  version: "",
  api: {
    operational: false,
    version: ""
  },
  dockerImages: {},
});

// Functions to update the state directly
const mutations = {
  setVersion(state, version) {
    state.version = version;
  },
  setApi(state, api) {
    state.api = api;
  },
  setDockerImageStatus(state, isInstalled) {
    state.dockerImages = {
      ...state.dockerImages,
      btcpayserver: isInstalled,
    };
  },
};

// Functions to get data from the API
const actions = {
  async getApi({ commit }) {
    const api = await API.get(`${process.env.VUE_APP_API_BASE_URL}/ping`);
    commit("setApi", {
      operational: !!(api && api.version),
      version: api && api.version ? api.version : ""
    });
  },
  async checkDockerContainer({ commit }) {
    try {
      const response = await API.get(`${process.env.VUE_APP_API_BASE_URL}/v1/monerod/system/check-image`);
      if (response) {
        commit('setDockerImageStatus', response.isInstalled);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error checking Docker image:', error);
    }
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
