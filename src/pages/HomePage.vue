<template>
  <q-page class="q-pa-md constrain">

    <div v-if="showNotifsBanner && pushNotifsSupported" class="bg-secondary">
      <div>
        <q-banner inline-actions class="bg-dark text-white q-mb-md">
          <q-icon class="q-px-xs" name="notifications" size="16px" />
          <b>Enable notifications?</b>

          <template v-slot:action>
            <q-btn @click="enableNotifs" flat icon="check" dense class="q-px-sm" />
            <q-btn @click="this.showNotifsBanner = false" flat icon="clear" dense class="q-px-sm" />
            <q-btn @click="neverShowNotifsBanner" flat label="Never" dense class="q-px-sm" />
          </template>
        </q-banner>
      </div>
    </div>

    <div class="row q-col-gutter-lg">

      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card v-for="post in posts" :key="post.id" class="my-card q-mb-md" flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>Abul_syed</q-item-label>
                <q-item-label caption>
                  {{ post.location }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img
              :src="post.imgUrl"
            />

            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">{{ formatDate(post.timestamp) }}</div>
            </q-card-section>
          </q-card>
        </template>

        <template v-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">Couldn't find any posts!</h5>
        </template>

        <!-- Skeleton loading effect -->
        <template v-if="loadingPosts">
          <q-card class="my-card q-mb-md" flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
      </div>

      <div class="col gt-xs">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Abul_syed</q-item-label>
            <q-item-label caption>
              Abul Syed
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

    </div>
    
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showNotifsBanner: false,
    }
  },
  computed: {
    ...mapState('posts', ['posts', 'loadingPosts']),
    pushNotifsSupported() {
      // check if push notifications support in browser, not just standard notifications
      return 'PushManager' in window
    },
    serviceWorkerSupported() {
      return 'serviceWorker' in navigator
    }
  },
  methods: {
    formatDate(timestamp){
      return date.formatDate(timestamp, 'Do MMM YYYY')
    },
    enableNotifs(){
      Notification.requestPermission(res => {
        this.neverShowNotifsBanner()
        if(res === 'granted') {
          // this.displayGrantedNotif()
          this.checkForExistingPushNotif()
        }
      })
    },
    checkForExistingPushNotif(){
      if(this.serviceWorkerSupported && this.pushNotifsSupported) {
        // check if there is subscription already present
        navigator.serviceWorker.ready.then(swreg => {
          return swreg.pushManager.getSubscription()
        }).then(sub => {
          if(!sub) {
            this.createPushSubscription()
          }
        })
      }
    },
    createPushSubscription(){
      navigator.serviceWorker.ready.then(swreg => {
        swreg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.PUBLIC_KEY
        }).then(sub => {
          let subData = sub.toJSON()
          return this.$axios.post(`${process.env.API}/subscription`, {
            endpoint: subData.endpoint,
            keys: {
              auth: subData.keys.auth,
              p256dh: subData.keys.p256dh
            }
          }).then(res => {
            this.displayGrantedNotif()
          }).catch(err => {
            console.log(err)
          })
        })
      })
    },
    displayGrantedNotif(){
      // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
      // Notification docs
      // new Notification('You\'re subbed to pushed notifications', {
      //   body: 'Thanks for subscribing',
      //   icon: 'icons/icon-128x128.png',
      //   iamge: 'icons/icon-128x128.png',
      //   badge: 'icons/icon-128x128.png',
      //   vibrate: [100, 50, 200],
      //   tag: 'confirm-notif',
      //   renotify: true
      // })
      if(this.serviceWorkerSupported && this.pushNotifsSupported) {
        // using service worker to display a notification
        navigator.serviceWorker.ready.then(swreg => {
          swreg.showNotification('You\'re subbed to pushed notifications', {
            body: 'Thanks for subscribing',
            icon: 'icons/icon-128x128.png',
            iamge: 'icons/icon-128x128.png',
            badge: 'icons/icon-128x128.png',
            vibrate: [100, 50, 200],
            tag: 'confirm-notif',
            renotify: true
          })
        })
      }
    },
    neverShowNotifsBanner(){
      this.showNotifsBanner = false
      localStorage.setItem('neverShowNotifsBanner', true)
    }
  },
  mounted() {
    let neverShowNotifsBanner = localStorage.getItem('neverShowNotifsBanner')

    if(!neverShowNotifsBanner) {
      this.showNotifsBanner = true;
    }
  }
}
</script>
