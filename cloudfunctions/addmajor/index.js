// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  var major_name = event.name;

  console.log("major" + major_name);

  const db = cloud.database();
  const _ = db.command

  var respon = {}
  var flag = null
  await db.collection('major').where({
    major_name: _.eq(major_name)
  }).get().then(res => {
    if (res['data'].length == 0) {
      console.log("还没有没有专业")
      flag = 0
    } else {
      console.log("该专业已存在");
      flag = 1;
    }
  })

  if(flag == 0){
    await db.collection('major').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        major_name: major_name
      }
    }).then(res => {
      respon['res'] = 1
      respon['msg'] = '专业插入成功'
    })
  }else if(flag == 1){
    respon['res'] = 0
    respon['msg'] = '该专业已经存在'
  }

  

  return respon;
}