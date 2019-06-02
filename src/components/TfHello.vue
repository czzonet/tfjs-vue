<template>
  <div align="center">
    <h1>散点图 scatter</h1>
    <button @click="run">run</button>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";

import getTrainData from "../utils/traindata.js";
import { createModel, convertToTensor, trainModel } from "../utils/model.js";

export default {
  name: "ScatterChart",
  data() {
    return {
      output: [[1, 1], [2, 3], [3, 5], [4, 7]]
    };
  },
  methods: {
    run() {
      /* 创建模型并展示 */
      let model = createModel();

      tfvis.show.modelSummary(
        { name: "Model summary", tab: "Model Inspection" },
        model
      );

      let { inputs, labels } = convertToTensor(this.output);
      trainModel(model, inputs, labels).then(() => {
        console.log("train done");
      });
    },
    initData() {
      /* 获取训练数据 */
      this.output = getTrainData();
      this.initChart();
    },
    showInputVisor() {
      const surface = tfvis
        .visor()
        .surface({ name: "My First Surface", tab: "Input Data" });
      const data = [
        { index: 0, value: 50 },
        { index: 1, value: 100 },
        { index: 2, value: 150 }
      ];
      tfvis.render.barchart(surface, data, {});
    },
    initChart() {
      let mychart = echarts.init(this.$refs.chart);
      mychart.setOption({
        title: {
          text: "horseopwer v mpg"
        },
        legend: {
          data: ["output"]
        },
        xAxis: [{ name: "horsepower" }],
        yAxis: [{ name: "mpg" }],
        series: [
          {
            name: "output",
            type: "scatter",
            symbolsize: 20,
            data: this.output
          }
        ]
      });
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style>
</style>
