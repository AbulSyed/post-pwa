import { api } from 'boot/axios'

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
    },
    ADD_POST(state, post){
      state.posts = state.posts.concat({
        _id: post.id,
        caption: post.caption,
        location: post.location,
        imgUrl: post.imgUrl,
        timestamp: post.timestamp
      })
    },
  },
  actions: {
    async getPosts(context){
      context.commit('SET_LOADING_POSTS', true)
      try {
        const res = await api.get(`${process.env.API}/posts`)
        context.commit('SET_POSTS', res.data)
        context.commit('SET_LOADING_POSTS', false)
      }catch(err){
        console.log(err.message)
        context.commit('SET_LOADING_POSTS', false)
      }
    },
    addPost(context, post){
      context.commit('ADD_POST', post)
      this.$router.push('/')
    }
  },
  getters: {

  }
}