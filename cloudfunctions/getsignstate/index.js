// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var lab_id = event.lab_id;
  var state;
  var now = new Date()
  console.log(now)
  respon = {}

  const db = cloud.database();
  const _ = db.command;

  await db.collection("labInfo").where({
    _id: lab_id
  }).get().then(res => {
    if (res['data'].length == 0) {
      console.log("没有查到该课程");
    } else {
      state = res.data[0]['state'];
      console.log(state)
    }
  })

  if(state == 0){
    respon['res'] = 0;
    respon['msg'] = '签到未开始'
  }else if(state == 1){
    var timeout; //签到时间是否超时 0为未超时 1为超时
    await db.collection('sign').where({
      lab_id: lab_id,
    }).get().then(res => {
      if (res['data'].length == 0) {
        console.log("没有找到签到信息")
      } else {
        var end_date = res['data'][0]['end_date']
        console.log(end_date)
        if(end_date.getTime() > now.getTime()){
          console.log("状态为正在签到");
          timeout = 0
          respon['res'] = 1
          respon['msg'] = '正在签到'
        }else{
          timeout = 1
          console.log("签到已过时")
        }
      }
    })
    if(timeout == 1){
      await db.collection('labInfo').doc(lab_id).update({
        data: {
          state: 2
        }
      }).then(res => {
        console.log("签到状态更新成功")
        respon['res'] = 2
        respon['msg'] = '签到已过时'
      })
    }
  }

  return respon

}