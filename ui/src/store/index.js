import { createStore } from "vuex";

//Modules
import system from "./modules/system";
import monero from "./modules/monero";
import user from "./modules/user";

// Initial State
const state = {
  isMobileMenuOpen: true
};

// Getters
const getters = {
  isMobileMenuOpen(state) {
    return state.isMobileMenuOpen;
  }
};

// Mutations
const mutations = {
  toggleMobileMenu(state) {
    //disable body's scrolling on menu open
    if (!state.isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      state.isMobileMenuOpen = true;
    } else {
      document.body.style.overflow = "auto";
      state.isMobileMenuOpen = false;
    }
  }
};

// Actions
const actions = {
  toggleMobileMenu(context) {
    context.commit("toggleMobileMenu");
  }
};

export default createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    system,
    monero,
    user
  }
});
