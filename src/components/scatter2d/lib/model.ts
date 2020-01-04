import * as tf from "@tensorflow/tfjs";

/**
  *  归一化
  */
const normalize = (s: tf.Tensor2D) => {
  const t = tf.tidy(() => { /** 最大差 */
    const distance = s.max().sub(s.min())
    /** 除数为零检查 */
    let zeroCheck = distance.dataSync()[0] == 0
    /** 为0不进行归一化 */
    return zeroCheck ? s : s.sub(s.min()).div(distance)
  })

  return t
}

/**
  *  反归一化
  */
const unNormalize = (s: any, minS: any, maxS: any) => {
  const t = tf.tidy(() => {
    return s.mul(maxS.sub(minS)).add(minS)
  })

  return t
}

/**
 * 分离点坐标为xs,ys  
 */
const splitPoint = (s: number[][]) => {
  let xs = s.map(d => d[0])
  let ys = s.map(d => d[1])
  return [xs, ys]
}

/**
 * 合并生成点坐标为[x,y]
 */
const combinePoint = (xs: number[], ys: number[]) => {
  let t = Array.from(xs).map((d, i) => {
    return [xs[i], ys[i]]
  })

  return t
}

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
    const [inputs, labels] = splitPoint(data)

    /** 形状要符合长度 数组两层嵌套二维所以2d */
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    let t = {} as any;

    /** 归一化 并保存范围信息用于以后反归一化 */
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
export const trainModel = async ({ model, normalizationData, config }: any) => {
  try {
    /** 配置优化器 损失函数 */
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    })
    let { inputs, labels } = normalizationData


    /** 训练 调整所有可变 */
    let t = await model.fit(inputs, labels, config)

    return t
  } catch (error) {
    console.log('[E] [trainModel]: ', error);

  }
}

/**
 * 测试模型
 */
export const testModel = (model: any, normalizationData: any) => {
  const { inputMax, inputMin, labelMax, labelMin } = normalizationData

  const [xs, preds] = tf.tidy(() => {
    /** 生成测试数值 */
    const xs = tf.linspace(0, 1, 100)
    /** 控制形状并预测结果 */
    const preds = model.predict(xs.reshape([100, 1]))

    /** 反归一化 */
    const unNormXs = unNormalize(xs, inputMin, inputMax)
    const unNormPreds = unNormalize(preds, labelMin, labelMax)

    /** 获取实际数值返回 */
    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })

  const predictedPoints = combinePoint(xs, preds)

  return predictedPoints
}
