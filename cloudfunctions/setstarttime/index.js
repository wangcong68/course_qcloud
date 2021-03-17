// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var start_time = event.start_time;
  var term = event.term;

  var date0 = new Date(start_time);
  //new Date(start_time.setHours(start_time.getHours() + 8))
  var date = new Date(date0.setHours(date0.getHours() - 8))
  var id = null
  
  console.log(" start_time: "+start_time+"  term: "+term);

  const db = cloud.database();
  const _ = db.command

  var respon = {}
  var flag = null;

  try {
    await db.collection('startdate').where({
      term:term
    }).get().then(res => {
      if (res['data'].length == 0) {
        console.log("没有该学期，可以插入该学期开始时间");
        flag = 0
      } else {
        id = res.data[0]['_id'];
        console.log("有该学期，更新该学期开学时间")
        flag = 1;
      }
    })

    if(flag == 0){
      await db.collection('startdate').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          start_time: date,
          term:term
        }
      }).then(res => {
        respon['res'] = 1
        respon['msg'] = '开始时间设置成功'
      })
    }else if(flag == 1){
      await db.collection("startdate").doc(id).update({
        data:{
          start_time:date
        }
      }).then(res => {
        respon['res'] = 1
        respon['msg'] = '开始时间设置成功'
      })
    }

    return respon
  } catch (e) {
    console.error(e)
  }
  /*var respon = {}
  const db = cloud.database();
  const _ = db.command
  await db.collection("labInfo").where({
    course_room:"东区101"
  }).update({
    data: {
      course_room:"东-三101"
    }
  }).then(res => {
    respon['res'] = 1
    respon['msg'] = '学期设置成功'
  })
  return respon*/
}