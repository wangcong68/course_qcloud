// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  var lab = event.lab;
  var week = event.week;
  var term = event.term;
  var start_time;

  console.log("lab=" + lab + " week=" + week + " term: "+term);

  const db = cloud.databas         
  const _ = db.command

  var respon = {}

  try {

    await db.collection("startdate").where({
      term: term
    }).get().then(res => {
      start_time = res.data[0]['start_time'];
      console.log("start_time: " + start_time)
    })
    var start = new Date(start_time.setHours(start_time.getHours() + 8)); //转换时区后的开始时间



    await db.collection('labInfo').where({
      course_week: _.eq(week),
      course_room: _.eq(lab),
      term:_.eq(term)
    }).get().then(res => {

      respon['res'] = 1
      respon['data'] = res.data
      respon['start_time'] = new Date(start.setHours(start_time.getHours() + (week - 1) * 7 * 24));

    })

    return respon

  } catch (e) {
    console.error(e)
  }


}