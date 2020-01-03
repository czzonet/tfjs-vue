<template>
  <div align="center">
    <h1>2d散点图（一个自变量，一个因变量）</h1>

    <h3>horseopwer: 马力 ;mpg: Miles per gallon，每加仑燃油行驶公里数</h3>

    <p>
      <el-form label-width="100px" inline>
        <el-form-item label="batchSize">
          <el-input-number v-model="batchSize"></el-input-number>
        </el-form-item>
        <el-form-item label="epotch">
          <el-input-number v-model="epotch"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button @click="run" type="primary" :disabled="isTraining">开始训练-train</el-button>
        </el-form-item>
      </el-form>
    </p>

    <div class="oneline">
      <div ref="chart" class="chart"></div>
      <div ref="performance" class="chart"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
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
      predictedData: [[50, 0]],
      lossData: [],
      mseData: [],
      chartPerformance: null,
      batchSize: 28,
      epotch: 50,
      isTraining: false
    };
  },
  methods: {
    run() {
      /* 创建模型并展示 */
      let model = createModel();

      /* 准备数据 */
      let noramlizationData = convertToTensor(this.originalData);
      let { inputs, labels } = noramlizationData;
      /** callbacks when training */
      let callbacks = {
        onTrainBegin: logs => {
          console.log("onTrainBegin: ", logs);
          this.$message.info("Train start!");
          this.isTraining = true;
        },
        onTrainEnd: logs => {
          console.log("onTrainEnd: ", logs);
          this.$message.info("Train end");
          this.isTraining = false;
        },
        onEpochEnd: (epoch, logs) => {
          // console.log('onEpochBegin: ', epoch, logs);
          this.lossData.push([epoch, logs.loss]);
          this.mseData.push([epoch, logs.mse]);
          /** refresh the performance chart */
          this.setChartPerformance();
        }
      };
      /* 训练模型 */
      trainModel(model, inputs, labels, callbacks).then(() => {
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
    /**
     * 配置和绘制图表
     */
    initChart() {
      let mychart = echarts.init(this.$refs.chart);
      mychart.setOption({
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
      });
    },
    /**
     * 配置和绘制运行表现图表
     */
    setChartPerformance() {
      /** init charft object once */
      this.chartPerformance
        ? null
        : (this.chartPerformance = echarts.init(this.$refs.performance));
      /** set style and dataset */
      this.chartPerformance.setOption({
        title: {
          text: "Training Performance"
        },
        legend: {
          data: ["loss", "mse"]
        },
        xAxis: [{ name: "epotch" }],
        yAxis: [{ name: "value" }],
        series: [
          {
            name: "loss",
            type: "line",
            smooth: true,
            data: this.lossData
          },
          {
            name: "mse",
            type: "line",
            smooth: true,
            data: this.mseData
          }
        ]
      });
    }
  },
  mounted() {
    /* 获取训练数据 */
    this.originalData = getTrainData();
    this.initChart();
    this.setChartPerformance();
  }
};
</script>

<style lang="scss" scoped>
.oneline {
  height: 800px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .chart1 {
    flex: 1;
  }
  .chart2 {
    flex: 1;
  }
}
</style>
