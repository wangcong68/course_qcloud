// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var lab_room = event.lab_room;

  console.log("lab_name" + lab_room);

  const db = cloud.database();
  const _ = db.command

  var respon = {}
  var flag = null
  await db.collection('lab').where({
    lab_room: _.eq(lab_room)
  }).get().then(res => {
    if (res['data'].length == 0) {
      console.log("还没有该实验室")
      flag = 0
    } else {
      console.log("该实验室已存在");
      flag = 1;
    }
  })

  if (flag == 0) {
    await db.collection('lab').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        lab_room: lab_room//
      }
    }).then(res => {
      respon['res'] = 1
      respon['msg'] = '实验室插入成功'
    })
  } else if (flag == 1) {
    respon['res'] = 0
    respon['msg'] = '该实验室已经存在'
  }



  return respon;
}