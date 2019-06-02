<template>
  <div align="center">
    <h1>图表</h1>
    <button @click="start" :disabled="intervalstatus">start</button>
    <button @click="end" :disabled="!intervalstatus">end</button>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "TfHello",
  data() {
    return {
      output: [1, 1, 1, 1],
      interval: null,
      intervalstatus: false
    };
  },

  methods: {
    start() {
      this.initchart();
    },
    end() {
      if (this.intervalstatus) {
        clearInterval(this.interval);
        this.intervalstatus = false;
      }
    },
    setData() {
      this.output.splice(
        0,
        this.output.length,
        ...[Math.random(), Math.random(), Math.random(), Math.random()]
      );
    },
    setChart() {
      let mychart = echarts.init(this.$refs.chart, "light");
      mychart.setOption({
        title: {
          text: "数据拟合图表"
        },
        // backgroundColor: "#2c343c",
        // textStyle: {
        //   color: "rgba(255,255,255,0.8)"
        // },
        // itemStyle: {
        //   color: "rgb(177, 223, 222)"
        // },
        // visualMap: {
        //   show: false,
        //   min: 0,
        //   max: 20,
        //   inRange: {
        //     colorLightness: [0, 1]
        //   }
        // },
        tooltip: {},
        legend: {
          data: ["output"]
        },
        xAxis: {
          data: [1, 2, 3, 4]
        },
        yAxis: {},
        series: [
          {
            name: "output",
            type: "bar",
            data: this.output
          }
        ]
      });
    },
    initchart() {
      this.interval = setInterval(() => {
        this.setData();
        this.setChart();
      }, 1000);
      this.intervalstatus = true;
    }
  },
  mounted() {
    this.setChart();
  }
};
</script>

<style scoped>
.chart {
  height: 400px;
  width: 600px;
}
</style>
