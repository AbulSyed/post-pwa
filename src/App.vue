<template>
  <router-view />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions('posts', ['getPosts'])
  },
  created(){
    this.getPosts()
  }
}
</script>
