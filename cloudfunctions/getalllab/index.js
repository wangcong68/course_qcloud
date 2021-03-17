// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {



  const db = cloud.database();
  const _ = db.command

  var respon = {}
  var data = {}

  try {

      await db.collection('lab').get().then(res => {
      
        respon['res'] = 1
        data['lab'] = res.data
        respon['msg'] = "获取成功"
      })

      await db.collection('onlinegrade').get().then(res => {

        data['grade'] = res.data
      })
      respon['data'] = data;
    return respon

  } catch (e) {
    console.error(e)
  }
}