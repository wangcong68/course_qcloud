// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var course_major = event.major;
  var course_name = event.name;
  var direction = event.direction;
  var term = event.term;

  console.log("major" + course_major + " courese_name" + course_name + "direction" + direction + "term" + term );

  const db = cloud.database();
  const _ = db.command

  var flag = null
  var respon = {}

  await db.collection('courses').where({
    course_major: _.eq(course_major),
    course_name:_.eq(course_name),
    direction: _.eq(direction),
    term: _.eq(term)

  }).get().then(res => {
    if (res['data'].length == 0) {
      console.log("还没有该课程")
      flag = 0
    } else {
      console.log("该课程已存在");
      flag = 1;
    }
  })

  if(flag == 0){
    await db.collection('courses').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        course_major: course_major,
        course_name: course_name,
        direction: direction,
        term: term
      }
    }).then(res => {
      respon['res'] = 1
      respon['msg'] = '课程插入成功'
    })

  }else{
    respon['res'] = 0
    respon['msg'] = '该课程已经存在'
  }
  
  
  return respon;
}