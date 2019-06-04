<template>
  <div align="center">
    <h1>3d散点图2 scatter3d2</h1>
    <h2>一个自变量，两个因变量</h2>
    <button @click="run">run</button>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
/* 3d包要额外引入 */
import "echarts-gl";

import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";

import {
  getTrainData,
  createModel,
  convertToTensor,
  trainModel,
  testModel
} from "../utils/model3d2.js";

export default {
  name: "Scatter3d",
  data() {
    return {
      originalData: [],
      predictedData: []
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
      // console.log("noramlizationData: ", noramlizationData.labelMax.print());
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
        let { xs, preds } = predictedPoints;
        console.log("preds: ", preds);
        let fresh = Array.from(xs).map((val, i) => {
          let tmp = [];
          tmp.push(preds[2 * i]);
          tmp.push(preds[2 * i + 1]);
          tmp.push(val);
          return tmp;
        });
        // console.log("fresh: ", fresh);
        this.predictedData = fresh;
        this.setChart();
      });
    },
    setChart() {
      let chart = echarts.init(this.$refs.chart);
      chart.setOption({
        title: {
          text: "3d chart2--input z,output (x,y)"
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
      });
    }
  },
  mounted() {
    this.originalData = getTrainData();
    this.setChart();
  }
};
</script>

<style>
</style>
