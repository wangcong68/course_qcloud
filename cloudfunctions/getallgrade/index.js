// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command

  var respon = {}

  try {
    await db.collection('class').get().then(res => {
      id = res.data[0]['_id'];
      class_grade = res.data[0]['class_grade'];

      console.log("res:  " + res)
      console.log("id " + id)
      console.log("class_grade: " + class_grade)
      respon['res'] = 1
      respon['data'] = res.data
      respon['msg'] = "获取年级成功"
    })

    return respon

  } catch (e) {
    console.error(e)
  }
}