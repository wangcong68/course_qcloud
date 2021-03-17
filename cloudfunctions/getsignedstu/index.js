// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  var lab_id = event.lab_id;
  const db = cloud.database();
  const _ = db.command
  var respon = {}
  await db.collection("sign").where({
    lab_id:lab_id
  }).get().then(res => {
    if(res['data'].length == 0){
      respon['res'] = 0
      respon['msg'] = "没有找到该实验签到信息"
    }else{
      respon['res'] = 1;
      respon['msg'] = '信息获取成功'
      respon['data'] = res.data[0].students
    }
  })

  return respon;
  
}