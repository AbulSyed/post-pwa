<template>
  <router-view />
</template>
<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('posts', ['getPosts']),
  },
  created(){
    this.getPosts()
  }
}
</script>
