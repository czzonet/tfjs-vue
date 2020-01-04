import * as tf from "@tensorflow/tfjs";

/**
 * createModel
 */
export const createModel = () => {
  /** Define model,add one layer after another,which do tidy automatically. */
  let model = tf.sequential();
  /** Here is the input layer,must has specify inputshape */
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  /* Here are any hidden layers 6层非线性层 */
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  /** Output layer */
  model.add(tf.layers.dense({ units: 1, }))

  return model
}

/**
 * 准备数据 规范化
 */
export const convertToTensor = (data: number[][]) => {
  /** use tidy to clean memory */
  const t = tf.tidy(() => {
    tf.util.shuffle(data);

    /** 数组对里提取分离x，y */
    const inputs = data.map(d => d[0])
    const labels = data.map(d => d[1])

    /** 形状要符合长度 数组两层嵌套二维所以2d */
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    /**
     *  归一化
     */
    const normalize = (s: tf.Tensor2D) => {
      /** 最大差 */
      const distance = s.max().sub(s.min())
      /** 除数为零检查 */
      let zeroCheck = distance.dataSync()[0] == 0
      /** 为0不进行归一化 */
      const t = zeroCheck ? s : s.sub(s.min()).div(distance)

      return t
    }

    let t = {} as any;

    t.inputMax = inputTensor.max()
    t.inputMin = inputTensor.min()
    t.labelMax = labelTensor.max()
    t.labelMin = labelTensor.min()
    t.inputs = normalize(inputTensor)
    t.labels = normalize(labelTensor)

    return t
  })

  return t
}

/**
 * 训练模型
 */
export const trainModel = async ({ model, inputs, labels, callbacks, batchSize, epochs }: any) => {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse']
  })

  let t = await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    // callbacks: tfvis.show.fitCallbacks(
    //   { name: 'Training Performance' },
    //   ['loss', 'mse'],
    //   { height: 200, callbacks: ['onEpochEnd'] }
    // ),
    callbacks

  })

  return t
}

/**
 * 测试模型
 */
export const testModel = (model: any, inputData: any, normalizationData: any) => {
  const { inputMax, inputMin, labelMax, labelMin } = normalizationData

  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100)
    const preds = model.predict(xs.reshape([100, 1]))

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)
    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin)

    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] }
  })
  const originalPoints = inputData.map((d: any) => {
    return { x: d[0], y: d[1] }
  })

  // tfvis.render.scatterplot(
  //   { name: 'Model Predictions vs Original Data' },
  //   { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
  //   {
  //     xLabel: 'horsepower',
  //     yLabel: 'mpg',
  //     height: 300
  //   }
  // )
  return predictedPoints
}