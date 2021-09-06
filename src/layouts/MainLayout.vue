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

    <q-footer class="bg-white text-grey-10" bordered>
      <div v-if="showInstallBanner" class="bg-primary">
        <div class="constrain">
          <q-banner dense inline-actions class="bg-primary text-white">
            Install Post PWA?

            <template v-slot:action>
              <q-btn @click="installApp" flat label="Yes" dense class="q-px-sm" />
              <q-btn @click="this.showInstallBanner = false" flat label="Later" dense class="q-px-sm" />
              <q-btn @click="neverShowInstallAppBanner" flat label="Never" dense class="q-px-sm" />
            </template>
          </q-banner>
        </div>
      </div>

      <q-tabs class="lt-sm">
        <q-route-tab icon="home" to="/" />
        <q-route-tab icon="camera" to="/camera" />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

export default {
  data() {
    return {
      showInstallBanner: false
    }
  },
  methods: {
    async installApp(){
      // Hide the app provided install promotion
      this.showInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      // Optionally, send analytics event with outcome of user choice
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
    },
    neverShowInstallAppBanner(){
      this.showInstallBanner = false
      localStorage.setItem('neverShowInstallAppBanner', true)
    }
  },
  mounted () {
    let neverShowInstallAppBanner = localStorage.getItem('neverShowInstallAppBanner')

    if(!neverShowInstallAppBanner) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.showInstallBanner = true;
      });
    }

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      this.showInstallBanner = false;
      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null;
      // Optionally, send analytics event to indicate successful install
      console.log('PWA was installed');
    });
  },
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