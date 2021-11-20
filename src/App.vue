<template>
  <div id="app">
    <SongAudio/>
    <router-view/>
  </div>
</template>

<script>
import SongAudio from './components/SongAudio.vue'
export default {
  name: 'App',
  components:{
    SongAudio
  }
}

</script>

<style>

</style>
