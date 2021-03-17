//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },


  test: function(){
    wx.cloud.callFunction({
      name : 'teacherlogin',
      data: {
        teach_id: "123456",
        password: "123456",
      },
      success: res => {
          console.log(res)
      }
    }) 
  },

  add: function(){
    wx.cloud.callFunction({
      name: 'add',
      data: {
        course_class: '集1，2 集3,4',
        course_date: '2019-03-22',
        course_name: '数字IC 版图设计',
        course_room: '东区101',
        teach_id: '00002891',
        grade: 16,
        part: 3,
        term:"helo"
      },
      success: res => {
        console.log(res)
      }
    }) 
  },

  mycourse: function () {
    wx.cloud.callFunction({
      name: 'mycourse',
      data: {
        teach_id: '00001356',
      },
      success: res => {
        console.log(res)
      }
    })
  },

  getInfo: function () {
    wx.cloud.callFunction({
      name: 'getInfobyweek',
      data: {
        lab: ' 西-新E1301',
        week: 14,
        //date: '2018-10-18'
      },
      success: res => {
        console.log(res)
      }
    })
  },

  deleteInfo: function () {
    wx.cloud.callFunction({
      name: 'deleteInfo',
      data: {
        _id: "W8sh3g6qgQy38jSW",
        teach_id: "00001356"
        //date: '2018-10-18'
      },
      success: res => {
        console.log(res)
      }
    })
  },

  allcourse: function () {
    wx.cloud.callFunction({
      name: 'allcourse',
      data: {},
      success: res => {
        console.log(res)
      }
    })
  },

  addcourses: function () {
    wx.cloud.callFunction({
      name: 'addcourses',
      data: {
        major: "heoo",
        name: "whaefever",
        direction: "E",
        term: "S"
      },
      success: res => {
        console.log(res)
      }
    })
  },

  addmajor: function () {
    wx.cloud.callFunction({
      name: 'addmajor',
      data: {
        name: "大数据专业",
      },
      success: res => {
        console.log(res)
      }
    })
  }, 

  getallmajor: function() {
    wx.cloud.callFunction({
      name: 'getallmajor',
      data: {},
      success: res => {
        console.log(res)
      }
    })
  },

  deletemajor: function () {
    wx.cloud.callFunction({
      name: 'deletemajor',
      data: {
        major_id:"XJCdFMDR1TiN_neP"
      },
      success: res => {
        console.log(res)
      }
    })
  }, 
  
  addgrade: function() {
    wx.cloud.callFunction({
      name: 'addgrade',
      data: {
        major_id: "453564",
        class_num:100,
        class_grade:2021
      },
      success: res => {
        console.log(res)
      }
    })
  },

  getallgrade: function () {
    wx.cloud.callFunction({
      name: 'getallgrade',
      data: {},
      success: res => {
        console.log(res)
      }
    })
  }, 

  deletegrade: function() {
    wx.cloud.callFunction({
      name: 'deletegrade',
      data: {
        class_id:"XJClnXkPDdDCJ7ap"
      },
      success: res => {
        console.log(res)
      }
    })
  }, 

  getallcourses: function() {
    wx.cloud.callFunction({
      name: 'getallcourses',
      data: {
        term: "S"
      },
      success: res => {
        console.log(res)
      }
    })
  },

  deletecourse: function () {
    wx.cloud.callFunction({
      name: 'deletecourse',
      data: {
        course_id: "XJCdFMDR1TiN_neP"
      },
      success: res => {
        console.log(res)
      }
    })
  },

  getinfotest: function () {
    wx.cloud.callFunction({
      name: 'getinfotest',
      data: {
        term: "2020年秋",
        //date: new Date().toDateString(),
        date:"2020-10-21",
        lab:"西-新1329"
      },
      success: res => {
        console.log(res)
      }
    })
  },

  /*setstarttime: function () {
    wx.cloud.callFunction({
      name: 'setstarttime',
      data: {
        term: "2019年春",
        start_time: "2019-03-04"
      },
      success: res => {
        console.log(res)
      }
    })
  }, */

  getInfobyweek: function() {
    wx.cloud.callFunction({
      name: 'getInfobyweek',
      data: {
        lab: "东区101",
        week: "3",
        term:"2019年春"
      },
      success: res => {
        console.log(res)
      }
    })
  },

  getalllab: function () {
    wx.cloud.callFunction({
      name: 'getalllab',
      data: {},
      success: res => {
        console.log(res)
      }
    })
  },

  addlab:function(){
    wx.cloud.callFunction({
      name: 'addlab',
      data:{
        lab_room:"the beautiful room",
      },
      success: res => {
        console.log(res)
      }
    })
  }, 
  deletelab: function() {
    wx.cloud.callFunction({
      name: 'deletelab',
      data: {
        lab_id: "XJI6tXffS3SWMYwK",
      },
      success: res => {
        console.log(res)
      }
    })
  },
  /*setstarttime: function () {
    wx.cloud.callFunction({
      name: 'setstarttime',
      data: {
      },
      success: res => {
        console.log(res)
      }
    })
  }, */

  doLogin: function(e){
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    wx.login({
      success: function(res) {
        console.log(res)
        //获取登录的临时凭证
        var code = res.code;
        //调用后端，获取微信的session_key,secret
        wx.request({
          url:"http://localhost:8080/wxlogin",
          data:{
            code:code,
            teacherId:"123456",
            password:"123456"
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: "POST",
          success: function(result){
            console.log(result);
          }

        })

      }
    })

  },


  logintest: function (e) {
    wx.request({
      url: "http://localhost:8080/test",
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'Cookie': 'JSESSIONID=D10E3032CF3302E6498144B88D0EEE80',
      },
      method: "POST",
      success: function (result) {
        console.log(result);
      }

    })
  },
  





















  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
