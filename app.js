// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res.code)
      }
    })
  },
  
  globalData: {
    userInfo: null,
    selectedPhotos: [], // 用户选择的照片
    currentTemplate: null, // 当前选择的模板
    canvasWidth: 750, // 画布宽度
    canvasHeight: 1000 // 画布高度
  }
})