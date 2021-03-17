// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var _id = event.lab_id

  const db = cloud.database();
  const _ = db.command

  respon = {}
  var flag = null

  try {

    await db.collection('lab').where({
      _id: _.eq(_id)
    }).get().then(res => {
      if (res['data'].length == 0) {
        respon['res'] = 0
        respon['msg'] = "没有该实验室"
        flag = 0
      } else {
        flag = 1;
      }
    })

    if (flag == 1) {

      await db.collection('lab').doc(_id).remove().then(res => {
        respon['res'] = 1
        respon['msg'] = '实验室删除成功'
        console.log("删除成功")
      })
    }

    return respon

  } catch (e) {
    console.error(e)
  }
}