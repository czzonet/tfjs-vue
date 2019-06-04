

export function getTrainData() {

  var data = [];
  for (let i = 0; i < 1000; i++) {
    //* 构造空间曲线方程组 x*x+y*y=50,2*x+z=50，即圆柱体与平面的相切，并且取x>0的半圆曲线 */ 
    var d = Math.random() * Math.PI // 0~PI,取一半。

    var x = 50 * Math.cos(d);
    var y = 50 * Math.sin(d)
    var z = 50 - 2 * x
    data.push([x, y, z]);
  }
  return data
}

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
export function createModel() {
  let model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  /* 4层非线性层 */
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 2, }))
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

    const inputs = data.map(d => d[2])
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()
    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))

    const labels = data.map(d => [d[0], d[1]])
    const labelTensor = tf.tensor2d(labels)
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
    /* z坐标取20个均分 */
    let x = Array.from({ length: 100 }, (val, i) => i).map(d => d / 100)

    let xs = tf.tensor2d(x, [100, 1])
    const preds = model.predict(xs)
    // preds.print()
    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)


    let a = labelMax.sub(labelMin)
    a.print()
    const unNormPreds = preds.mul(a).add(labelMin)
    preds.print()
    labelMax.print()
    labelMin.print()
    unNormPreds.print()
    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })

  return { xs, preds }
}