<template>
  <div>
    <div ref="chartdata" class="small-chart"></div>
  </div>
</template>

<script>
/** echarts */
import echarts from "echarts";

export default {
  name: "ChartPerformanceMse",
  props: ["mseData"],
  data() {
    return {
      chartHandle: null
    };
  },
  watch: {
    mseData: {
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
          text: "Performance"
        },
        legend: {
          data: ["mse"]
        },
        xAxis: [{ name: "epotch" }],
        yAxis: [{ name: "value" }],
        series: [
          {
            name: "mse",
            type: "line",
            // smooth: true,
            data: this.mseData
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
.small-chart {
  width: 500px;
  height: 350px;
}
</style>
