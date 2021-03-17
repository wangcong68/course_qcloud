// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  var teach_id = event.teach_id
  var flag = 0
  var course_teacher
  var myDate = new Date();

  var year = myDate.getFullYear();
  console.log("年份"+year)
  var month = (myDate.getMonth() + 1).toString();
  var day = (myDate.getDate()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  //var dateTime =

  var date = year + "-" + month + "-" + day;; //获取当前日期
  console.log("当前日期"+date)

  const db = cloud.database();
  const _ = db.command

  respon = {}

  await db.collection('teacher').where({
    teach_id: _.eq(teach_id)
  }).get().then(res => {
    console.log(res)
    console.log(res['data'])
    if (res['data'].length == 0) {
      respon['res'] = 0;
      respon['msg'] = '无此用户'
    }
    else {
      course_teacher = res.data[0]['teacher_name']
      console.log("教师是：" + course_teacher)
      flag = 1
    }
  })

  
  if(flag == 1){
    await db.collection('labInfo').where({
      course_teacher: _.eq(course_teacher),
      course_date : _.gte(date)
    }).orderBy('course_date', 'asc').orderBy('part', 'asc').get().then(res => {
      console.log(res)
      console.log(res['data'])
      respon['res'] = 1;
      respon['data'] = res.data
     
    })
  }
  return respon
}