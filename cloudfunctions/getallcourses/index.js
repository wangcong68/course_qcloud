// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var term = event.term
  console.log("term " + term);
  const db = cloud.database();
  const _ = db.command

  var respon = {}

  try {
    await db.collection('courses').where({
      term:term
    }).get().then(res => {
      id = res.data[0]['_id'];
      course_major = res.data[0]['major'];
      console.log("res:  " + res)
      console.log("id " + id)
      respon['res'] = 1
      respon['data'] = res.data
      respon['msg'] = "获取课程成功"
    })

    return respon

  } catch (e) {
    console.error(e)
  }
}