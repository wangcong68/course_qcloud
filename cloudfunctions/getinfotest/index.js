
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("获取首页信息")
  var term = event.term;
  var lab = event.lab;
  var date = event.date;

  var start_time; //该学期开学的第一天
  var week;

  console.log("lab=" + lab + "  date=" + date + "  term="+term)
  var date0 = new Date(date);//传过来的当前时间
  console.log("转换后Date: "+ date0)

  const db = cloud.database();
  const _ = db.command

  var respon = {}

  try {

    var flag = null;
    await db.collection("startdate").where({
      term:term
    }).get().then(res => { 
      if (res['data'].length == 0) {
        console.log("没有该学期");
        console.log("啦啦啦")
        respon['res'] = 0;
        console.log("嘿嘿嘿")
        respon['msg'] = "没有该学期"
        flag = 0;
      } else {
        start_time = res.data[0]['start_time'];
        console.log("start_time: " + start_time)
      }
    })

    if(flag == 0){
      return respon
    }else{
      var start = new Date(start_time.setHours(start_time.getHours() + 8)); //转换时区后的开始时间

      console.log("北京")

      var days = (date0.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
      var daysrest = ((date0.getTime() - start.getTime()) % (1000 * 60 * 60 * 24));
      if (daysrest != 0) {
        days = days + 1;
      }
      console.log("差的天数为： " + days)
      var week = days / 7;
      console.log("week: " + week)
      var rest = days % 7;
      if (rest != 0) {
        week += 1;
      }
      week = parseInt(week)
      console.log("当前周数为：   " + week);
      //respon['week'] = week


      await db.collection('labInfo').where({
        term:_.eq(term),
        course_week: _.eq(week),
        course_room: _.eq(lab)
      }).get().then(res => {

        respon['res'] = 1
        respon['data'] = res.data
        respon['start_time'] = new Date(start.setHours(start_time.getHours() + (week - 1) * 7 * 24)); // 应为本周的开始时间
        respon['week'] = week

      })

      return respon

    }

    
  } catch (e) {
    console.error(e)
  }
}