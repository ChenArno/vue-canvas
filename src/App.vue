<template>
  <div id="app">
    <canvas-view :src="pic"></canvas-view>
  </div>
</template>

<script>
import canvasView from './components/canvas'

export default {
  name: 'App',
  components: {
    canvasView
  },
  data(){
    return{
      pic:"http://chuantu.biz/t6/340/1531101936x1822611299.jpg"
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
