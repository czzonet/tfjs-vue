<template>
  <div align="center">
    <h1>2d散点图（一个自变量，一个因变量）</h1>

    <!-- <h3>horseopwer: 马力 ;mpg: Miles per gallon，每加仑燃油行驶公里数</h3> -->

    <p>
      训练数据 数量：{{originalData.length+1}}
      <el-form label-width="100px" inline>
        <el-form-item label="batchSize">
          <el-input-number v-model="batchSize"></el-input-number>
        </el-form-item>
        <el-form-item label="epochs">
          <el-input-number v-model="epochs"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button @click="run" type="primary" :disabled="isTraining">开始训练-train</el-button>
        </el-form-item>
      </el-form>
    </p>

    <div class="one-row">
      <div class="col1">
        <div ref="chartdata" class="chart"></div>
      </div>
      <div class="col2">
        <div class="one-columm">
          <div ref="chartperformanceloss" class="chart-small"></div>
          <div ref="chartperformancemse" class="chart-small"></div>
        </div>
      </div>
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
      chartData: null /** The data chart */,
      chartPerformanceLoss: null /** The performance chart */,
      chartPerformanceMse: null /** The performance chart */,
      callbacks: null /** All callbacks when training */,
      originalData: [[1, 1], [2, 3], [3, 5], [4, 7]],
      predictedData: [[50, 0]],
      lossData: [],
      mseData: [],
      batchSize: 28,
      epochs: 20,
      isTraining: false
    };
  },
  methods: {
    reset() {
      this.predictedData.splice(0, this.predictedData.length);
      this.lossData.splice(0, this.lossData.length);
      this.mseData.splice(0, this.mseData.length);
      this.setCharts();
    },
    run() {
      this.isTraining = true;
      this.reset();
      /* 创建模型 */
      let model = createModel();
      /* 准备数据 */
      let normalizationData = convertToTensor(this.originalData);
      let config = {
        batchSize: this.batchSize,
        epochs: this.epochs,
        shuffle: true,
        callbacks: this.callbacks
      };

      /* 训练模型 */
      trainModel({ model, normalizationData, config }).then(() => {
        /* 测试模型 */
        this.predictedData = testModel(model, normalizationData);
        this.setDataChart();
      });
    },
    /**
     * 配置和绘制图表
     */
    setDataChart() {
      this.chartData.setOption({
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
    setChartPerformanceLoss() {
      /** set style and dataset */
      this.chartPerformanceLoss.setOption({
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
      });
    },
    /**
     * 配置和绘制运行表现图表
     */

    setChartPerformanceMse() {
      /** set style and dataset */
      this.chartPerformanceMse.setOption({
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
      });
    },
    setCallbacks() {
      this.callbacks = {
        onTrainBegin: logs => {
          console.log("onTrainBegin: ");
          this.$message.success("Train start!");
        },
        onTrainEnd: logs => {
          console.log("onTrainEnd: ");
          this.$message.success("Train end!");
          this.isTraining = false;
        },
        onEpochEnd: (epoch, logs) => {
          this.lossData.push([epoch, logs.loss]);
          this.mseData.push([epoch, logs.mse]);
          /** refresh the performance chart */
          this.setCharts();
        }
      };
    },
    initCharts() {
      this.chartData = echarts.init(this.$refs.chartdata);
      this.chartPerformanceLoss = echarts.init(this.$refs.chartperformanceloss);
      this.chartPerformanceMse = echarts.init(this.$refs.chartperformancemse);

      this.setCharts();
    },
    setCharts() {
      this.setDataChart();
      this.setChartPerformanceLoss();
      this.setChartPerformanceMse();
    }
  },
  mounted() {
    /* 获取训练数据 */
    this.originalData = getTrainData();
    this.initCharts();

    this.setCallbacks();
  }
};
</script>

<style lang="scss" scoped>
.one-row {
  // height: 800px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .col1 {
    flex: 1;
  }
  .col2 {
    flex: 1;

    .one-column {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

.chart {
  width: 900px;
  height: 700px;
}

.chart-small {
  width: 500px;
  height: 350px;
}
</style>
