import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
  state:{
    useType:"move"
  },
  mutations:{
    SET_USETYPE:(state,useType)=>{
      state.useType = useType;
    }
  },
  getters:{
    useType:state=>state.useType
  }
})

export default store