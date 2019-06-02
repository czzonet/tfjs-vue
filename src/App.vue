<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <tf-hello></tf-hello>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import TfHello from "./components/TfHello";
export default {
  name: "app",
  components: {
    HelloWorld,
    TfHello
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.chart {
  height: 720px;
  width: 1080px;
}
</style>
