export default function getTrainData() {
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
