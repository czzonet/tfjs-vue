/**
 * 创建一个高斯分布函数
 */
function makeGaussian(amplitude: any, x0: any, y0: any, sigmaX: any, sigmaY: any) {
  return function (amplitude: any, x0: any, y0: any, sigmaX: any, sigmaY: any, x: any, y: any) {
    var exponent = -(
      (Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)))
      + (Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)))
    );
    return amplitude * Math.pow(Math.E, exponent);
  }.bind(null, amplitude, x0, y0, sigmaX, sigmaY);
}

export default function getTrainData() {
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
