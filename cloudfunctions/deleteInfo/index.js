// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  var _id = event._id
  var teach_id = event.teach_id
  var teacher_name
  var flag = 0

  const db = cloud.database();
  const _ = db.command

  respon = {}

  try {

    await db.collection('teacher').where({
      teach_id : _.eq(teach_id)
    }).get().then(res => {
      teacher_name = res.data[0]['teacher_name']
    })

    console.log("teacher_name" + teacher_name)

    await db.collection('labInfo').where({
      _id: _id,
      //course_teacher: _.neq(teacher_name)
    }).get().then(res => {
      if (res['data'].length == 0) {
        respon['res'] = 2
        respon['msg'] = '该条数据不存在'
        console.log("数据不存在")
      }
      else{
        if(teacher_name != res.data[0]['course_teacher']){
          respon['res'] = 0
          respon['msg'] = '不能删除其他老师的课程'
          console.log("无权限")
        }
        else{
          flag = 1
        }
      }

    })

    if(flag == 1){
      console.log("可以删除")
      await db.collection('labInfo').doc(_id).remove().then(res => {
        respon['res'] = 1
        respon['msg'] = '课程删除成功'
        console.log("删除成功")
      })
    }

    return respon

  } catch (e) {
    console.error(e)
  }

}