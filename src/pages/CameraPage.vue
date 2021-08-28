<template>
  <q-page class="q-pa-md constrain-large">

    <div class="camera-frame q-pa-md">
      <video v-show="!imgCaptured" ref="video" class="full-width" autoplay />
      <canvas v-show="imgCaptured" ref="canvas" class="full-width" height="240" />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="cameraEnabled"
        @click="captureImg"
        icon="camera"
        size="lg"
        dense
        flat
        round
      />
      <div class="row justify-center">
        <q-file
          v-if="!cameraEnabled"
          v-model="imgUpload"
          @update:model-value="captureImgFallback"
          accept="image/*"
          label="Select an image"
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
        <q-btn flat dense round icon="add" size="lg" />
      </div>
    </div>

  </q-page>
</template>

<script>
import { uid } from 'quasar'
import { mapState, mapActions } from 'vuex'

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
      imgCaptured: false,
      imgUpload: [],
      // cameraEnabled: true,
      locationLoading: false
    }
  },
  computed: {
    ...mapState('camera', ['cameraEnabled'])
  },
  methods: {
    ...mapActions('camera', ['initCamera', 'disableCamera']),
    captureImg(){
      let video = this.$refs.video
      let canvas = this.$refs.canvas

      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height

      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.imgCaptured = true

      canvas.toBlob(blob => (this.post.photo = blob))
      this.disableCamera(this.$refs.video)
    },
    captureImgFallback(file){
      this.post.photo = file

      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')

      var reader = new FileReader()
      reader.onload = e => {
        var img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img,0,0)
          this.imgCaptured = true
        }
        img.src = e.target.result
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
  mounted(){
    this.initCamera(this.$refs.video)
  },
  beforeUnmount(){
    if(this.cameraEnabled){
      this.disableCamera(this.$refs.video)
    }
  }
}
</script>

<style lang="scss">
  .camera-frame {
    border: 2px solid $grey-10;
    border-radius: 10px;
  }
</style>