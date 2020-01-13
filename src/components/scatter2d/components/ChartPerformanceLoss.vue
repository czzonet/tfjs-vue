<template>
  <div>
    <div ref="chartdata" class="small-chart"></div>
  </div>
</template>

<script>
/** echarts */
import echarts from "echarts";

export default {
  name: "ChartPerformanceLoss",
  props: ["lossData"],
  data() {
    return {
      chartHandle: null
    };
  },
  watch: {
    lossData: {
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
          data: ["loss"]
        },
        xAxis: [{ name: "epotch" }],
        yAxis: [{ name: "value" }],
        series: [
          {
            name: "loss",
            type: "line",
            // smooth: true,
            itemStyle: {
              normal: {
                color: "#545c64",
                lineStyle: {
                  color: "#545c64"
                }
              }
            },

            data: this.lossData
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
