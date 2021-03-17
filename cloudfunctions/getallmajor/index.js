// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command

  var respon = {}

  try {
    await db.collection('major').get().then(res => {
      id = res.data[0]['_id'];
      major_name = res.data[0]['major_name'];
      console.log("res:  "  + res)
      console.log("id "+ id)
      console.log("major_name: " + major_name)
      respon['res'] = 1
      respon['data'] = res.data
      respon['msg'] = "获取专业成功"
    })

    return respon

  } catch (e) {
    console.error(e)
  }
}