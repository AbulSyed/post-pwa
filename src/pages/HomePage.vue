<template>
  <q-page class="q-pa-md constrain">

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
  computed: {
    ...mapState('posts', ['posts', 'loadingPosts'])
  },
  methods: {
    formatDate(timestamp){
      return date.formatDate(timestamp, 'Do MMM YYYY')
    }
  }
}
</script>
