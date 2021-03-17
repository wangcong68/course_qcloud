// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database();
  const _ = db.command;
  var array = [];
  var length;
  // Promise 风格
  await db.collection('labInfo').skip(300).limit(400).get().then(res => {
      length = res.data.length;
      console.log(res.data.length)
      var i;
    for (i = 0; i < length; i++) {
      console.log(res.data[i]["_id"]);
      array.push(res.data[i]["_id"])
    }
    })
    .catch(err => {
      console.log("eeeeeee")
      console.error(err)
    })
  for(i = 0; i < array.length; i++){
    await db.collection('labInfo').doc(array[i]).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        state: 0
      },
      success: console.log,
      fail: console.error
    })
  }
  
}