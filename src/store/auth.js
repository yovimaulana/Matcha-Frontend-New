import axios from 'axios'
import DataService from '../services/DataService'
//utils/auth.js


export function setHeaderToken (token) { 
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export function removeHeaderToken () {
  delete axios.defaults.headers.common['Authorization']
}

export default {
    state: {
        user: null,
        isLoggedIn: false,
    },
    mutations: {
        set_user(state, data) {
            state.user = data
            state.isLoggedIn = true
        },
        reset_user(state) {
            state.user = null
            state.isLoggedIn = false
        }
    },
    getters: {
        isLoggedIn(state) {
            return state.isLoggedIn
        },
        user(state) {
            return state.user
        }
    },
    actions: {
        login({commit}, data) {
            return new Promise((resolve, reject) => {
                // axios.post('https://matcha-dev.bps.go.id/matcha-backend/api/login', data)
                DataService.login(data)
                    .then(response => {
                        
                        if(response.data.meta.status == 'success')
                        {   
                            const token = response.data.data.access_token                            
                            localStorage.setItem('token', token)
                            setHeaderToken(token)  
                            commit('set_user', response.data.data.user)                          
                            // dispatch('get_user')
                        }                                                                        
                        
                        resolve(response)
                    })
                    .catch(err => {
                        commit('reset_user')
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        login_sso({commit}, data) {
            const token = data.data.access_token
            localStorage.setItem('token', token)
            setHeaderToken(token) 
            commit('set_user', data.data.user)
            return
        },
        async get_user({commit}) {

            if (!localStorage.getItem('token')) return;

            try {
                // let response = await axios.get('https://matcha-dev.bps.go.id/matcha-backend/api/users/current')
                let response = await DataService.getCurrentUser()
                // console.log('myresponse current user', response)
                commit('set_user', response.data.data)
            } catch (error) {
                commit('reset_user')
                removeHeaderToken()
                localStorage.removeItem('token')
                return error
            }
        },
        logout({ commit }) {
            return new Promise((resolve) => {
             commit('reset_user')
             localStorage.removeItem('token')
             removeHeaderToken()
             resolve()
            })
           }
    }
}