<template>
  <div>
    <div ref="chartdata" class="big-chart"></div>
  </div>
</template>

<script>
/** echarts */
import echarts from "echarts";

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
          text: "horseopwer v mpg"
        },
        legend: {
          data: ["original训练数据", "predicted预测结果"]
        },
        xAxis: [{ name: "horsepower" }],
        yAxis: [{ name: "mpg" }],
        series: [
          {
            name: "original训练数据",
            type: "scatter",
            symbolsize: 20,
            data: this.originalData
          },
          {
            name: "predicted预测结果",
            type: "scatter",
            symbolsize: 20,
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
