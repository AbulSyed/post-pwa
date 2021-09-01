import { api } from 'boot/axios'
import { Dialog } from 'quasar'

export default {
  namespaced: true,
  state: {
    posts: [],
    loadingPosts: false
  },
  mutations: {
    SET_POSTS(state, posts){
      state.posts = posts
    },
    SET_LOADING_POSTS(state, loadingPosts){
      state.loadingPosts = loadingPosts
    }
  },
  actions: {
    async getPosts(context){
      context.commit('SET_LOADING_POSTS', true)
      try {
        const res = await api.get('http://localhost:3000/posts')
        context.commit('SET_POSTS', res.data)
        context.commit('SET_LOADING_POSTS', false)
      }catch(err){
        Dialog.create({
          title: 'Alert',
          message: err.message
        })
        context.commit('SET_LOADING_POSTS', false)
      }
    }
  },
  getters: {

  }
}