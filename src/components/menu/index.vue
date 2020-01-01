<template>
  <div>
    <el-menu router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="/main">首页</el-menu-item>

      <el-submenu index="1">
        <template slot="title">演示散点图</template>

        <el-menu-item index="/main/scatter2d">2d 散点图</el-menu-item>
        <el-menu-item index="/main/scatter3d">3d 散点图</el-menu-item>
        <el-menu-item index="/main/scatter3d2">3d 散点图2</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "MenuBar"
};
</script>

<style>
</style>