// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var teach_id = event.teach_id;
  var password = event.password;

  console.log('teach_id' + teach_id + 'password' + password);
  const db = cloud.database();
  const _ = db.command;

  respon = {}

  return await db.collection('teacher').where({
    teach_id: _.eq(teach_id),
    password: _.eq(password)
  }).get().then(res => {
    console.log(res)
    console.log(res['data'])
    if (res['data'].length == 0){
      respon['res'] = 0;
      respon['msg'] = '无此用户'
    }
    else{
      respon['res'] = 1;
      respon['msg'] = '登录成功'
      respon['teacher_name'] = res.data[0]['teacher_name']
    }

    return respon

  })



}