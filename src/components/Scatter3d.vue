<template>
  <div align="center">
    <h1>3d散点图 scatter3d</h1>
    <button @click="run">run</button>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-gl";
export default {
  name: "Scatter3d",
  data() {
    return {
      originalData: [],
      predictedData: []
    };
  },
  methods: {
    run() {},
    setChart() {
      let chart = echarts.init(this.$refs.chart);
      chart.setOption({
        title: {
          text: "3d chart"
        },
        grid3D: {},
        xAxis3D: [{ name: "x" }],
        yAxis3D: [{ name: "y" }],
        zAxis3D: [{ name: "z" }],
        series: [
          {
            name: "3d",
            type: "scatter3D",
            dimensions: ["x", "y", "z"],
            data: [[1, 1, 1]]
          }
        ]
      });
    }
  },
  mounted() {
    this.setChart();
  }
};
</script>

<style>
</style>
