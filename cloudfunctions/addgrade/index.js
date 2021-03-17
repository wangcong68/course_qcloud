// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var major_id = event.major_id;
  var class_num = event.class_num;
  var class_grade = event.class_grade;

  console.log("major_id: " + major_id + " class_num: "+class_num+" class_grade: ");

  const db = cloud.database();
  const _ = db.command

  var respon = {}
  var flag = null
  var flag1 = null
  var major_name = null

  await db.collection('major').where({
    _id: _.eq(major_id)
  }).get().then(res => {
    if (res['data'].length == 0) {
      respon['res'] = 0
      respon['msg'] = "没有该专业"
      return respon
    }else{
      major_name = res.data[0]['major_name']
      console.log("major_name: "+major_name)
      flag = 1
    }
  })

  await db.collection('class').where({
    class_major: _.eq(major_name),
    class_grade: _.eq(class_grade),
  }).get().then(res => {
    if (res['data'].length == 0) {
      console.log("还没有该年级")
      flag1 = 0
    } else {
      console.log("该年级已存在");
      respon['res'] = 2
      respon['msg'] = "该年级已存在"
      return respon
    }
  })
  
  if (flag == 1 && flag1==0) {

    await db.collection('class').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        class_major: major_name,
        class_grade:class_grade,
        class_num: class_num
      }
    }).then(res => {
      respon['res'] = 1
      respon['msg'] = '年级添加成功'
    })
  }


  return respon;
}