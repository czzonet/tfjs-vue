tfjs-echarts-vue
=

在vue中使用echarts图表展示机器学习的例子。tfjs是tensorflow的js实现，使得可以用浏览器进行机器学习。  
感觉非常好用，或者说简直不要太棒，完全符合自己已有技术和发展需求。所以赶紧参考官方实例实践了一遍，预测了2d数据，并拿echarts散点图重新可视化了数据。  
对应官方示例见最下面的参考小节。

演示
--

![](./tfjs-vue.png)


直接使用
--

```
yarn
yarn serve
```
点击run即可训练模型，观察损失，最后输出预测结果

起步构建
--

如果你想从头走一遍
```
vue create echarts-vue
cd echarts-vue
yarn add echarts 
yarn add @tensorflow/tfjs
yarn add @tensorflow/tfjs-vis
```
然后参照官方教程，进行编程即可。

References
--

1. [Making predictions from 2d data &nbsp;|&nbsp; TensorFlow.js &nbsp;|&nbsp; TensorFlow](https://www.tensorflow.org/js/tutorials/training/linear_regression)
2. [TensorFlow.js — Making Predictions from 2D Data](https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html)

