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
          class="col col-sm-6"
          dense
          label="location">
          <template v-slot:append>
            <q-btn round dense flat icon="room" />
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
      cameraEnabled: true
    }
  },
  methods: {
    initCamera(){
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        console.log(this.$refs.video)
        this.$refs.video.srcObject = stream
      }).catch(err => {
        this.cameraEnabled = false
      })
    },
    captureImg(){
      let video = this.$refs.video
      let canvas = this.$refs.canvas

      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height

      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.imgCaptured = true
      
      canvas.toBlob(blob => (this.post.photo = blob))
      this.disableCamera()
    },
    disableCamera(){
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
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
    }
  },
  mounted(){
    this.initCamera()
  },
  beforeUnmount(){
    if(this.cameraEnabled){
      this.disableCamera()
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