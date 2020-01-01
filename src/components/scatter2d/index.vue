<template>
  <div align="center">
    <h1>2d散点图 scatter2d</h1>
    <h2>一个自变量，一个因变量</h2>
    <el-button @click="run" type="primary">train</el-button>
    <br />
    <br />
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";

import getTrainData from "./lib/traindata.ts";
import {
  createModel,
  convertToTensor,
  trainModel,
  testModel
} from "./lib/model.ts";

export default {
  name: "Scatter2d",
  data() {
    return {
      originalData: [[1, 1], [2, 3], [3, 5], [4, 7]],
      predictedData: [[50, 50]]
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
      /* 准备数据 */
      let noramlizationData = convertToTensor(this.originalData);
      let { inputs, labels } = noramlizationData;
      /* 训练模型 */
      trainModel(model, inputs, labels).then(() => {
        console.log("train done");
        /* 测试模型 */
        let predictedPoints = testModel(
          model,
          this.originalData,
          noramlizationData
        );
        this.predictedData = predictedPoints.map((val, i) => {
          return [val.x, val.y];
        });
        this.initChart();
      });
    },
    initData() {
      /* 获取训练数据 */
      this.originalData = getTrainData();
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
          data: ["original", "predicted"]
        },
        xAxis: [{ name: "horsepower" }],
        yAxis: [{ name: "mpg" }],
        series: [
          {
            name: "original",
            type: "scatter",
            symbolsize: 20,
            data: this.originalData
          },
          {
            name: "predicted",
            type: "scatter",
            symbolsize: 20,
            data: this.predictedData
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
