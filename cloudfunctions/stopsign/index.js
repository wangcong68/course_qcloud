// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var lab_id = event.lab_id;
  var respon = {}

  const db = cloud.database();
  const _ = db.command

  try {
    var state;
    await db.collection('labInfo').where({
      _id:lab_id
      }).get().then(res => {
        if(res['data'].length == 0){
          console.log("没有找到该实验课程");
        }else{
          console.log(res.data)
          state = res.data[0].state;
          console.log(state)
        }
    })

    if(state == 1){
      respon['res'] = 2;
      respon['msg'] = "签到已经结束了"
      return respon;
    }

    await db.collection('labInfo').doc(lab_id).update({
      data: {
        state: 1
      }
    }).then(res => {
      respon['res'] = 1
      respon['msg'] = "设置成功"
    })
  } catch (e) {
    respon['res'] = 0
    respon['msg'] = "设置失败";
    console.error(e)
  }
  return respon;
}
