// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var student_id = event.student_id;//学生学号
  var password = event.password; //四位口令
  var lab_id = event.lab_id; //实验课id
  var openid = wxContext.OPENID;
  //var openid = "helloworld"
  var now = new Date()
  console.log("openId" + openid)
  var state;
  var respon = {}

  const db = cloud.database();
  const _ = db.command;


  try {
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
    
    if (state == 1) {

      var timeout
      await db.collection('sign').where({
        lab_id: lab_id,
      }).get().then(res => {
        if (res['data'].length == 0) {
          console.log("没有找到签到信息")
        } else {
          var end_date = res['data'][0]['end_date']
          console.log(end_date)
          if (end_date.getTime() > now.getTime()) {
            console.log("状态为正在签到");
            timeout = 0
          } else {
            timeout = 1
            console.log("签到已过时")
          }
        }
      })
      if (timeout == 1) {
        var isReturn;
        await db.collection('labInfo').doc(lab_id).update({
          data: {
            state: 2
          }
        }).then(res => {
          console.log("签到状态更新成功")
          respon['res'] = 0
          respon['msg'] = '签到已过时'
          isReturn = 1;
        })
        if(isReturn = 1){
          return respon;
        }
      }else if(timeout == 0){
        var passwordflag;
        await db.collection("sign").where({
          lab_id: lab_id
        }).get().then(res => {
          console.log("hello") //没问题
          if (res['data'].length == 0) {
            console.log("没有查到签到信息");
          } else {
            console.log(res.data)
            key = res.data[0].password;
            console.log(key);
            if (key == password) {
              console.log("密码正确")
            } else {
              console.log("密码错误");
              passwordflag = 0;

            }
          }
        })
        if (passwordflag == 0) {
          respon['res'] = 4;
          respon['msg'] = "口令错误"
          return respon;
        }
        //口令正确了 更新同学和微信号
        var issigned;
        await db.collection('sign').where({
          lab_id: lab_id,
          open_id: openid
        }).get().then(res => {
          if (res['data'].length == 0) {
            console.log("该微信号之前并未签到");
            console.log(res['data'][0])
          } else {
            issigned = 1;
            console.log(res['data'])
          }
        })
        if (issigned == 1) {
          respon['res'] = 2
          respon['msg'] = "你已经签过到了";
          console.log("返回已签到");
          return respon
        }

        var sign_id;
        await db.collection("sign").where({
          lab_id: lab_id
        }).get().then(res => {
          sign_id = res.data[0]._id
        })
        
        if (sign_id != null) {
          await db.collection('sign').doc(sign_id).update({
            data: {
              students: _.push(student_id),
              open_id:_.push(openid)
            }
          }).then(res => {
            respon['res'] = 1;
            respon['msg'] = "签到成功";
          })
        }
      }
    }
} catch (e) {
    respon['res'] = 3;
    respon['msg'] = "签到失败";
    console.error(e)
  }

  return respon;

}