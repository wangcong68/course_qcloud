// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('hello');
  var course_class = event.course_class
  var course_date = event.course_date
  var course_name = event.course_name
  var course_room = event.course_room
  var teach_id = event.teach_id
  var grade = event.grade
  var part = event.part
  var term = event.term
  var course_week
  var course_teacher
  var start_time
  var flag = 0;
  var date0 = new Date(course_date);//传过来的当前时间
  
  console.log()

  console.log('hi')
  const db = cloud.database();
  const _ = db.command

  var respon = {}

  var flag0 = null;
  try {
    await db.collection("startdate").where({
      term: term
    }).get().then(res => {
      if (res['data'].length == 0) {
        console.log("没有该学期");
        respon['res'] = 2;
        respon['msg'] = "没有该学期"
        flag0 = 0;
      } else {
        start_time = res.data[0]['start_time'];
        console.log("start_time: " + start_time)
      }
    })

    if (flag0 == 0) {
      return respon
    } else {
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
      course_week = parseInt(week)
      console.log("当前周数为：   " + week);
    }
    /*await db.collection('weeks').where({
      start_time: _.lte(course_date),
      end_time: _.gte(course_date),
      //start_time:_.eq(x)
    }).get().then(res => {
      course_week = res.data[0]['week'];
      console.log(course_week);
    })*/

    await db.collection('teacher').where({
      teach_id: teach_id
    }).get().then(res => {
      course_teacher = res.data[0]['teacher_name']
    })

    await db.collection('labInfo').where({
      course_date: _.eq(course_date),
      part: _.eq(part),
      course_room: _.eq(course_room)
    }).get().then(res => {
      if (res['data'].length != 0) {
        respon['res'] = 2
        respon['msg'] = '该时间段已被占用！'
        flag = 2
        console.log("该时间段已被占用")
      }
    })

    if(flag == 0){
      await db.collection('labInfo').where({
        course_class: _.eq(course_class),
        course_date: _.eq(course_date),
        course_name: _.eq(course_name),
        course_room: _.eq(course_room),
        course_teacher: _.eq(course_teacher),
        course_week: _.eq(course_week),
        grade: _.eq(grade),
        part: _.eq(part)
        //start_time:_.eq(x)
      }).get().then(res => {
        console.log(res)
        if (res['data'].length == 0) {
          flag = 1; //可以插入数据
        }
        else {
          respon['res'] = 0;
          respon['msg'] = '该条数据已存在'
        }
      })

      if (flag == 1) {
        await db.collection('labInfo').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            course_class: course_class,
            course_date: course_date,
            course_name: course_name,
            course_room: course_room,
            course_teacher: course_teacher,
            course_week: course_week,
            grade: grade,
            part: part,
            term:term,
            state:0
          }
        }).then(res => {
          respon['res'] = 1
          respon['msg'] = '数据插入成功'
        })
      }
    }

    return respon

  } catch (e) {
    console.error(e)
  }
  
}