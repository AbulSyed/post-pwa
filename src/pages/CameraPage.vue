<template>
  <q-page class="q-pa-md constrain-large">

    <div class="camera-frame q-pa-md">
      <canvas ref="canvas" class="full-width" height="120" />
    </div>

    <div class="text-center q-pa-md">
      <div class="row justify-center q-pa-md">
        <q-file
          v-model="img"
          @update:model-value="getImg"
          accept="image/*"
          label="Upload an image"
          outlined
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>

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
          :loading="locationLoading"
          class="col col-sm-6"
          dense
          label="location">
          <template v-slot:append v-if="!locationLoading">
            <q-btn
              @click="getLocation"
              icon="room"
              dense
              flat
              round
            />
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
      },
      img: [],
      locationLoading: false
    }
  },
  methods: {
    handleClick(){
      console.log(this.post)
    },
    getImg(file){
      // updates photo data and set canvas to image selected
      this.post.photo = file

      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')

      var reader = new FileReader();
      reader.onload = event => {
        var img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img,0,0)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    },
    getLocation(){
      this.locationLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        this.getCityAndCountry(position)
      }, err => {
        console.log(err)
        this.showLocationError()
      }, { timeout: 7000 })
    },
    async getCityAndCountry(position){
      try {
        let res = await this.$axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
  
        this.post.location = `${res.data.address.city}, ${res.data.address.country}`
        this.locationLoading = false
      }catch(err){
        console.log(err)
        this.showLocationError()
      }
    },
    showLocationError(){
      this.$q.dialog({
        title: 'Alert',
        message: 'Could not find your location'
      })
      this.locationLoading = false
    }
  },
}
</script>

<style lang="scss">
  .camera-frame {
    border: 2px solid $grey-10;
  }
</style>