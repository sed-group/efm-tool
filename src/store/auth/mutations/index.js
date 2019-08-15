export default {
  setUser(state, payload) {
    state.user = payload;
  },
  removeUser(state, payload) {
    state.user = null;
  },
  setUserLoginStatus(state, payload) {
    state.userLoginStatus = payload;
  },
  setUserLoginError(state, payload) {
    state.userLoginError = payload;
  },
}