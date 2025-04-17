Page({
  /**
   * 页面的初始数据
   */
  data: {
    packageId: '',
    packageName: '',
    form: {
      name: '',
      phone: '',
      address: '',
      addressDetail: '',
      date: '',
      timeSlot: '',
      remark: ''
    },
    timeSlots: [
      '上午 9:00-12:00', 
      '下午 13:00-15:00', 
      '下午 15:00-18:00'
    ],
    timeSlotIndex: 0,
    minDate: '',
    maxDate: '',
    privacyAgreed: false,
    submitDisabled: true,
    showPrivacyModal: false,
    showSuccessModal: false,
    // 记录位置信息
    location: {
      latitude: null,
      longitude: null,
      name: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.packageId) {
      this.setData({
        packageId: options.packageId,
        packageName: decodeURIComponent(options.packageName || '')
      });
      
      // 设置日期范围（从明天开始，到60天后）
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      
      const maxDateObj = new Date(now);
      maxDateObj.setDate(now.getDate() + 60);
      
      this.setData({
        minDate: this.formatDate(tomorrow),
        maxDate: this.formatDate(maxDateObj)
      });
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 格式化日期为YYYY-MM-DD
   */
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 选择日期
   */
  onDateChange: function (e) {
    this.setData({
      'form.date': e.detail.value
    });
    this.checkFormValid();
  },

  /**
   * 选择时间段
   */
  onTimeSlotChange: function (e) {
    const timeSlotIndex = e.detail.value;
    this.setData({
      timeSlotIndex,
      'form.timeSlot': this.data.timeSlots[timeSlotIndex]
    });
    this.checkFormValid();
  },

  /**
   * 选择地址
   */
  chooseLocation: function () {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'form.address': res.address,
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name
          }
        });
        this.checkFormValid();
      },
      fail: (err) => {
        // 用户取消选择或发生错误
        if (err.errMsg !== 'chooseLocation:fail cancel') {
          wx.showToast({
            title: '选择地址失败',
            icon: 'none'
          });
        }
      }
    });
  },

  /**
   * 隐私政策同意状态变更
   */
  onPrivacyChange: function (e) {
    this.setData({
      privacyAgreed: e.detail.value.length > 0
    });
    this.checkFormValid();
  },

  /**
   * 检查表单是否有效
   */
  checkFormValid: function () {
    const { form, privacyAgreed } = this.data;
    const isValid = 
      form.name.trim() !== '' && 
      /^1\d{10}$/.test(form.phone) && 
      form.address !== '' && 
      form.addressDetail.trim() !== '' && 
      form.date !== '' && 
      form.timeSlot !== '' && 
      privacyAgreed;
    
    this.setData({
      submitDisabled: !isValid
    });
  },

  /**
   * 显示隐私政策
   */
  showPrivacyPolicy: function () {
    this.setData({
      showPrivacyModal: true
    });
  },

  /**
   * 隐藏隐私政策
   */
  hidePrivacyModal: function () {
    this.setData({
      showPrivacyModal: false
    });
  },

  /**
   * 隐藏成功弹窗
   */
  hideSuccessModal: function () {
    this.setData({
      showSuccessModal: false
    });
  },

  /**
   * 提交预约
   */
  submitBooking: function () {
    if (this.data.submitDisabled) {
      return;
    }
    
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    
    // 这里模拟API请求，实际项目中应替换为真实API调用
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟提交成功
      this.setData({
        showSuccessModal: true
      });
      
      // 清空表单
      this.setData({
        form: {
          name: '',
          phone: '',
          address: '',
          addressDetail: '',
          date: '',
          timeSlot: '',
          remark: ''
        },
        privacyAgreed: false,
        submitDisabled: true
      });
    }, 1500);
  },

  /**
   * 返回上一页
   */
  goBack: function () {
    wx.navigateBack();
  },

  /**
   * 阻止冒泡
   */
  preventBubble: function () {
    return;
  }
}); 