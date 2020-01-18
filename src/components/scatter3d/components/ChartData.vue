<template>
  <div>
    <div ref="chartdata" class="big-chart"></div>
  </div>
</template>

<script>
/** echarts */
import echarts from "echarts";
/* 3d包要额外引入 */
import "echarts-gl";

export default {
  name: "ChartData",
  props: ["originalData", "predictedData"],
  data() {
    return {
      chartHandle: null
    };
  },
  watch: {
    originalData: {
      handler() {
        this.setDataChart();
      }
    },
    predictedData: {
      handler() {
        this.setDataChart();
      }
    }
  },
  methods: {
    /**
     * 配置和绘制图表
     */
    setDataChart() {
      let optionClause = {
        title: {
          text: "3d chart--input (x,y),output z"
        },
        legend: {
          data: ["original", "predicted"]
        },
        backgroundColor: "rgb(243, 242, 243)",
        grid3D: {},
        xAxis3D: [{ name: "x" }],
        yAxis3D: [{ name: "y" }],
        zAxis3D: [{ name: "z" }],
        series: [
          {
            name: "original",
            type: "scatter3D",
            dimensions: ["x", "y", "z"],
            data: this.originalData
          },
          {
            name: "predicted",
            type: "scatter3D",
            dimensions: ["x", "y", "z"],
            data: this.predictedData
          }
        ]
      };
      this.chartHandle.setOption(optionClause);
    },
    initChart() {
      this.chartHandle = echarts.init(this.$refs.chartdata);
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

<style lang="scss" scoped>
.big-chart {
  width: 900px;
  height: 700px;
}
</style>
