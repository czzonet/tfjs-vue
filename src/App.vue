<template>
  <div id="app">
    <router-link to="/scatter2d">2d 散点图</router-link>
    <span>&nbsp;|&nbsp;</span>
    <router-link to="/scatter3d">3d 散点图</router-link>
    <span>&nbsp;|&nbsp;</span>
    <router-link to="/scatter3d2">3d 散点图2</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
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
