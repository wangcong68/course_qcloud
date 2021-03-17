// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  
  var lab_id = event.lab_id;
  var password = RandomNumBoth(1000,9999);
  console.log("password: "+password);
  var date = new Date()
  var end_date = new Date(date.setMinutes(date.getMinutes()+5))
  var respon = {}

  const db = cloud.database();
  const _ = db.command

  try {
    var flag;
    await db.collection('sign').where({
      lab_id:lab_id
    }).get().then(res =>{
      if (res['data'].length == 0){
        console.log("这是第一次签到")
        flag = 1
      }else{
        flag = 0
        console.log("之前已经设置过签到了")
        respon['res'] = 2
        respon['msg'] = '之前已经设置过签到了'
      }
    })
    if(flag == 0){
      return respon
    }else if(flag == 1){
      await db.collection('labInfo').doc(lab_id).update({
        data: {
          state: 1
        }
      }).then(res => {
        console.log("状态更新成功")
      })

      await db.collection('sign').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          lab_id: lab_id,
          password: password,
          end_date:end_date,
          students: [],
          open_id:[]
        }
      }).then(res => {
        respon['res'] = 1
        respon['msg'] = "签到设置成功"
        respon['password'] = password
      })
    }

  } catch (e) {
    respon['res'] = 0
    respon['msg'] = "设置失败";
    console.error(e)
  }

  return respon;
}

function RandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}