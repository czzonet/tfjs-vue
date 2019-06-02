import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
export function createModel() {
  let model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
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

    const inputs = data.map(d => d[0])
    const labels = data.map(d => d[1])

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()
    const labelMax = labelTensor.max()
    const labelMin = labelTensor.min()

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
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
  const epochs = 50

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

export function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMax, labelMin } = normalizationData

  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100)
    const preds = model.predict(xs.reshape([100, 1]))

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)
    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin)

    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })
  // TODO: 返回echarts数据
  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] }
  })
  const originalPoints = inputData.map(d => {
    return { x: d[0], y: d[1] }
  })

  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
    {
      xLabel: 'horsepower',
      yLabel: 'mpg',
      height: 300
    }
  )
}