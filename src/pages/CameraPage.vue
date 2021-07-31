<template>
  <q-page class="q-pa-md constrain-large">

    <div class="camera-frame q-pa-md">
      <q-img
        src="https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=1600&h=800&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2017%2F02%2Feiffel-tower-paris-france-EIFFEL0217.jpg"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        icon="camera"
        size="lg"
        dense
        flat
        round
      />
      <div class="row justify-center q-pa-md">
        <q-input
          v-model="post.caption"
          class="col col-sm-6"
          dense
          label="caption"
        />
      </div>
      <div class="row justify-center q-pa-md">
        <q-input
          v-model="post.location"
          class="col col-sm-6"
          dense
          label="location">
          <template v-slot:append>
            <q-btn round dense flat icon="room" />
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-pa-md">
        <q-btn flat dense round icon="add" size="lg" @click="handleClick" />
      </div>
    </div>

  </q-page>
</template>

<script>
import { uid } from 'quasar'

export default {
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now()
      }
    }
  },
  methods: {
    handleClick() {
      console.log(this.post)
    }
  },
}
</script>

<style lang="scss">
  .camera-frame {
    border: 2px solid $grey-10;
    border-radius: 10px;
  }
</style>