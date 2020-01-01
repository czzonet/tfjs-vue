<template>
  <div class="layout">
    <div class="left">
      <div class="fullmenu">
        <bar-menu></bar-menu>
      </div>
    </div>
    <div class="right">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import BarMenu from "@/components/menu/index";

export default {
  name: "BarLayout",
  components: { BarMenu }
};
</script>

<style>
.layout .el-menu {
  border-width: 0px;
}
</style>

<style lang="scss" scoped>
.layout {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  .left {
    flex-basis: 200px;
    height: 100%;

    background-color: #545c64;
  }
  .right {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
