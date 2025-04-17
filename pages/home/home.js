// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    packages: [
      {
        id: 'studio',
        title: 'Studio 套餐',
        description: '适合单间公寓，经济实用',
        price: 29,
        unit: '周',
        coverImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        features: ['单人床', '冰箱', '洗衣机', '书桌椅']
      },
      {
        id: '1bed',
        title: '1房套餐',
        description: '功能齐全，适合单人或情侣',
        price: 33,
        unit: '周',
        coverImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        features: ['双人床', '沙发、茶几', '冰箱、洗衣机', '餐桌椅、书桌椅']
      },
      {
        id: '2bed',
        title: '2房套餐',
        description: '合租首选，性价比高',
        price: 40,
        unit: '周',
        coverImage: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        features: ['双人床 x2', '沙发、茶几', '冰箱、洗衣机', '餐桌椅、书桌椅 x2'],
        tag: '推荐'
      },
      {
        id: '3bed',
        title: '3房套餐',
        description: '宽敞舒适，多人合租优选',
        price: 48,
        unit: '周',
        coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        features: ['双人床 x3', '沙发、茶几', '冰箱、洗衣机', '餐桌椅、书桌椅 x3']
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 可以在这里从服务器获取套餐数据
    // this.getPackagesData();
  },

  /**
   * 从服务器获取套餐数据
   */
  getPackagesData: function() {
    wx.showLoading({
      title: '加载中',
    });
    
    wx.request({
      url: 'https://api.juwo.com/packages',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            packages: res.data.data
          });
        } else {
          wx.showToast({
            title: '获取套餐信息失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  /**
   * 滚动到套餐区域
   */
  scrollToPackages: function() {
    wx.createSelectorQuery()
      .select('#packages')
      .boundingClientRect(function(rect){
        wx.pageScrollTo({
          scrollTop: rect.top,
          duration: 300
        });
      })
      .exec();
  },

  /**
   * 套餐卡片点击事件处理
   */
  onPackageCardTap: function(e) {
    // 这个函数在组件内部已处理跳转逻辑，这里可以添加额外的分析统计等
    console.log('卡片点击:', e.detail.packageInfo);
  },

  /**
   * 套餐卡片按钮点击事件处理
   */
  onPackageButtonTap: function(e) {
    // 这个函数在组件内部已处理跳转逻辑，这里可以添加额外的分析统计等
    console.log('按钮点击:', e.detail.packageInfo);
  },

  /**
   * 联系客服
   */
  contactUs: function() {
    wx.navigateTo({
      url: '/pages/contact/contact'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '桔屋家具 - 悉尼留学生家具优选',
      path: '/pages/home/home',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    };
  }
}); 