export default {
  namespaced: true,
  state: {
    cameraEnabled: true
  },
  mutations: {
    SET_CAMERA_ENABLED(state, cameraEnabled){
      state.cameraEnabled = cameraEnabled
    }
  },
  actions: {
    initCamera(context, videoRef){
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        videoRef.srcObject = stream
      }).catch(err => {
        context.commit('SET_CAMERA_ENABLED', false)
        console.log(err)
      })
    },
    disableCamera(context, videoRef){
      videoRef.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
    }
  },
  getters: {

  }
}