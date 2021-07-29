<template>
  <q-page class="q-pa-md constrain">

    <div class="row q-col-gutter-lg">

      <div class="col-12 col-sm-8">
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
  computed: {
    ...mapState('posts', ['posts'])
  },
  methods: {
    formatDate(timestamp){
      return date.formatDate(timestamp, 'Do MMM YYYY')
    }
  }
}
</script>
