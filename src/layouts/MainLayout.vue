<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">

        <q-btn flat dense round size="18px" icon="home" to="/" class="gt-xs" />

        <q-separator vertical spaced class="gt-xs" />

        <q-toolbar-title class="text-grand-hotel">
          Post pwa
        </q-toolbar-title>

        <q-btn flat dense round size="18px" icon="camera" to="/camera" class="gt-xs" />

      </q-toolbar>
    </q-header>

    <q-footer class="bg-white text-grey-10 lt-sm" bordered>
      <q-tabs>
        <q-route-tab icon="home" to="/" />
        <q-route-tab icon="camera" to="/camera" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.q-toolbar {
  @media screen and (min-width: 600px){
    height: 77px;
  }
}
.q-toolbar__title {
  @media screen and (max-width: 599px) {
    text-align: center;
  }
  font-size: 30px;
}
</style>