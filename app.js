// app.js
App({
  globalData: {
    userInfo: null,
    apiBase: 'https://api.juwo.com' // API基础路径，可根据环境配置
  },
  
  onLaunch: function () {
    // 检查更新
    this.checkUpdate();
    
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    
    // 获取胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    this.globalData.menuButtonInfo = menuButtonInfo;
    
    // 计算导航栏高度
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
  },
  
  // 检查小程序更新
  checkUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本下载失败，请检查网络后重试',
              showCancel: false
            });
          });
        }
      });
    }
  },
  
  // 获取用户信息
  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo);
      } else {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            this.globalData.userInfo = res.userInfo;
            resolve(res.userInfo);
          },
          fail: (err) => {
            reject(err);
          }
        });
      }
    });
  }
}); 