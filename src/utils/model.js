import * as tf from "@tensorflow/tfjs";

export default function createModel() {
  let model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1, }))
  return model
}