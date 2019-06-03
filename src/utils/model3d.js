/**
 * 创建一个高斯分布函数
 *
 * @param   {[type]}  amplitude  [amplitude description]
 * @param   {[type]}  x0         [x0 description]
 * @param   {[type]}  y0         [y0 description]
 * @param   {[type]}  sigmaX     [sigmaX description]
 * @param   {[type]}  sigmaY     [sigmaY description]
 *
 * @return  {[type]}             [return description]
 */
function makeGaussian(amplitude, x0, y0, sigmaX, sigmaY) {
  return function (amplitude, x0, y0, sigmaX, sigmaY, x, y) {
    var exponent = -(
      (Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)))
      + (Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)))
    );
    return amplitude * Math.pow(Math.E, exponent);
  }.bind(null, amplitude, x0, y0, sigmaX, sigmaY);
}

export function getTrainData() {
  var gaussian = makeGaussian(50, 0, 0, 20, 20);

  var data = [];
  for (var i = 0; i < 1000; i++) {
    // x, y 随机分布
    var x = Math.random() * 100 - 50;
    var y = Math.random() * 100 - 50;
    var z = gaussian(x, y);
    data.push([x, y, z]);
  }
  return data
}

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
export function createModel() {
  let model = tf.sequential();
  model.add(tf.layers.dense({ units: 2, inputShape: [2] }));
  // /* 6层非线性层 */
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  // model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }))
  // model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }))
  // model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }))
  // model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }))
  // model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }))
  model.add(tf.layers.dense({ units: 1, }))
  return model
}
/**
 * 准备数据
 *
 * @param   {[Array]}  data  散点数组
 *
 * @return  {[any]}        规范化的数据对象
 */
export function convertToTensor(data = []) {
  return tf.tidy(() => {
    tf.util.shuffle(data);

    const inputs = data.map(d => [d[0], d[1]])
    const inputTensor = tf.tensor2d(inputs)
    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()
    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))

    const labels = data.map(d => d[2])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])
    const labelMax = labelTensor.max()
    const labelMin = labelTensor.min()
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))



    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin
    }
  })
}

/**
 * 训练模型
 *
 * @param   {[type]}  model   [model description]
 * @param   {[type]}  inputs  [inputs description]
 * @param   {[type]}  labels  [labels description]
 *
 * @return  {[type]}          [return description]
 */
export async function trainModel(model, inputs, labels) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse']
  })

  const batchSize = 28
  const epochs = 20

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  })
}

/**
 * 测试模型
 *
 * @param   {[type]}  model              [model description]
 * @param   {[type]}  inputData          [inputData description]
 * @param   {[type]}  normalizationData  [normalizationData description]
 *
 * @return  {[type]}                     [return description]
 */
export function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMax, labelMin } = normalizationData

  const [xs, preds] = tf.tidy(() => {
    /* 横坐标取20个均分 */
    let x = Array.from({ length: 20 }, (val, i) => i).map(d => d / 20)
    let fresh = []
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        /* 每个点的x，y值 */
        fresh.push(x[i])
        fresh.push(x[j])
      }
    }
    /* 生成20x20的均匀散点 共400个 */
    let xs = tf.tensor2d(fresh, [400, 2])
    const preds = model.predict(xs)

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)
    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin)

    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })


  // const originalPoints = inputData.map(d => {
  //   return { x: d[0], y: d[1] }
  // })

  // tfvis.render.scatterplot(
  //   { name: 'Model Predictions vs Original Data' },
  //   { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
  //   {
  //     xLabel: 'horsepower',
  //     yLabel: 'mpg',
  //     height: 300
  //   }
  // )
  return { xs, preds }
}