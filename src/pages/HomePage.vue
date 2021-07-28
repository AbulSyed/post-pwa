<template>
  <q-page class="q-pa-md constrain">
    
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

  </q-page>
</template>

<script>
import { date } from 'quasar'

export default {
  data() {
    return {
      posts: [
        {
          id: 1,
          caption: 'ps5',
          timestamp: 1627391662801,
          location: 'London, United Kingdom',
          imgUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/heres-your-first-look-at-the-playstation-5-console-1591911618591.jpg?crop=0.563xw:1.00xh;0.164xw,0&resize=640:*'
        },
        {
          id: 2,
          caption: 'Spiderman',
          timestamp: 1627391662801,
          location: 'New York, USA',
          imgUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/spiderman-1604616315.jpg?crop=0.5xw:1xh;center,top&resize=640:*'
        },
        {
          id: 3,
          caption: 'Eiffel tower',
          timestamp: 1627491662801,
          location: 'Paris, France',
          imgUrl: 'https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=1600&h=800&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2017%2F02%2Feiffel-tower-paris-france-EIFFEL0217.jpg'
        },
      ]
    }
  },
  methods: {
    formatDate(timestamp){
      return date.formatDate(timestamp, 'Do MMM YYYY')
    }
  }
}
</script>
