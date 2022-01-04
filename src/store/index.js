import { createStore } from 'vuex'
import { mutations } from './mutations';
import { actions } from './actions';
const store = createStore({
    state () {
      return {
        // 当前登录的用户信息
        userData: ""
      }
    },
    mutations: mutations,
    actions: actions
  })

  export default store;