const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    packageIndex: -1,
    appointmentDate: '',
    minDate: '',
    packages: [
      { id: 'studio', name: 'Studio套餐' },
      { id: '1bed', name: '1房套餐' },
      { id: '2bed', name: '2房套餐' },
      { id: '3bed', name: '3房套餐' }
    ],
    reviews: [
      {
        id: 1,
        userName: '小张同学',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
        content: '刚来悉尼就在桔屋订了一套家具，真的省心省力！送货上门还帮忙安装，家具也都很干净，性价比超高！',
        timeText: '1个月前'
      },
      {
        id: 2,
        userName: '王同学',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.5,
        content: '三个室友合租，选了3房套餐。价格合理，家具质量也挺好，最棒的是回购服务，毕业回国不用愁处理家具了！',
        timeText: '2个月前'
      }
    ],
    company: {
      name: 'JUWO桔屋',
      subtitle: 'Home Furnishing',
      description: 'JUWO桔屋专注为悉尼国际留学生提供平价、经过专业清洁消毒的二手家具套餐服务，所有套餐均包含一年期回购服务，让您的留学生活既温馨舒适，又经济实惠。',
      logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      contact: {
        wechat: 'JUWO_Sydney',
        phone: '+61 4XX XXX XXX',
        email: 'contact@juwo.com.au',
        serviceArea: '悉尼全区域，免费配送安装'
      },
      workingHours: '周一至周日 9:00-21:00'
    },
    // 地图标记点
    markers: [{
      id: 1,
      latitude: -33.8688,
      longitude: 151.2093,
      name: 'JUWO桔屋',
      callout: {
        content: 'JUWO桔屋',
        color: '#FF8C42',
        fontSize: 14,
        borderRadius: 4,
        bgColor: '#ffffff',
        padding: 8,
        display: 'ALWAYS'
      }
    }],
    // 表单数据
    formData: {
      name: '',
      phone: '',
      message: ''
    },
    // 表单错误信息
    errors: {
      phone: '',
      message: ''
    },
    // 是否正在提交
    submitting: false,
    // 是否显示成功弹窗
    showSuccessModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置最小日期为今天
    const today = new Date();
    const minDate = today.getFullYear() + '-' + this.padZero(today.getMonth() + 1) + '-' + this.padZero(today.getDate());
    this.setData({
      minDate: minDate
    });
    
    // 如果是从套餐详情页传递过来的套餐ID，自动选择该套餐
    if (options.packageId) {
      const packageId = options.packageId;
      const index = this.data.packages.findIndex(item => item.id === packageId);
      if (index !== -1) {
        this.setData({
          packageIndex: index
        });
      }
    }
    
    // 获取评价数据
    this.getReviews();
    
    // 可以根据参数预填充表单
    if (options.source) {
      // 记录来源
      this.setData({
        source: options.source
      });
    }
  },

  /**
   * 格式化数字，个位数补0
   */
  padZero: function(num) {
    return num < 10 ? '0' + num : num;
  },

  /**
   * 套餐选择改变事件
   */
  packageChange: function(e) {
    this.setData({
      packageIndex: e.detail.value
    });
  },

  /**
   * 日期选择改变事件
   */
  dateChange: function(e) {
    this.setData({
      appointmentDate: e.detail.value
    });
  },

  /**
   * 提交预约
   */
  submitAppointment: function(e) {
    const formData = e.detail.value;
    const packageInfo = this.data.packageIndex > -1 ? this.data.packages[this.data.packageIndex] : null;
    
    // 表单验证
    if (!formData.name.trim()) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.contact.trim()) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      });
      return;
    }
    
    if (!packageInfo) {
      wx.showToast({
        title: '请选择意向套餐',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.appointmentDate) {
      wx.showToast({
        title: '请选择预计入住日期',
        icon: 'none'
      });
      return;
    }
    
    // 显示提交中状态
    wx.showLoading({
      title: '提交中',
      mask: true
    });
    
    // 构建请求体
    const requestData = {
      name: formData.name,
      contact: formData.contact,
      package: packageInfo.id,
      moveInDate: this.data.appointmentDate,
      message: formData.message || ''
    };
    
    // 发送预约请求到后端
    wx.request({
      url: `${app.globalData.apiBase}/api/appointments`,
      method: 'POST',
      data: requestData,
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          wx.hideLoading();
          wx.showToast({
            title: '预约提交成功',
            icon: 'success',
            duration: 2000
          });
          
          // 重置表单
          this.setData({
            packageIndex: -1,
            appointmentDate: ''
          });
          
          // 添加等待后再返回
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        } else {
          this.handleError('预约提交失败，请稍后重试');
        }
      },
      fail: () => {
        this.handleError('网络错误，请检查网络连接');
      }
    });
  },
  
  /**
   * 获取用户评价
   */
  getReviews: function() {
    wx.request({
      url: `${app.globalData.apiBase}/api/reviews`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            reviews: res.data.data.list || this.data.reviews
          });
        }
      }
    });
  },
  
  /**
   * 处理错误
   */
  handleError: function(message) {
    wx.hideLoading();
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 拨打电话
   */
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: '+61412345678',
      success: () => {
        console.log('拨打电话成功');
      },
      fail: (err) => {
        console.log('拨打电话失败', err);
      }
    });
  },

  /**
   * 复制微信号
   */
  copyWechat: function() {
    wx.setClipboardData({
      data: 'JUWO_Service',
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 发送邮件
   */
  sendEmail: function() {
    wx.setClipboardData({
      data: this.data.company.contact.email,
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 输入姓名
   */
  inputName: function(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  /**
   * 输入电话
   */
  inputPhone: function(e) {
    const phone = e.detail.value;
    this.setData({
      'formData.phone': phone
    });
    
    // 验证手机号
    if (phone && !/^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$|^(\+)?61[0-9]{9}$/.test(phone)) {
      this.setData({
        'errors.phone': '请输入有效的手机号码'
      });
    } else {
      this.setData({
        'errors.phone': ''
      });
    }
  },

  /**
   * 输入留言
   */
  inputMessage: function(e) {
    const message = e.detail.value;
    this.setData({
      'formData.message': message
    });
    
    // 验证留言内容
    if (message && message.length < 5) {
      this.setData({
        'errors.message': '留言内容不能少于5个字符'
      });
    } else {
      this.setData({
        'errors.message': ''
      });
    }
  },

  /**
   * 提交表单
   */
  submitForm: function(e) {
    const formData = e.detail.value;
    
    // 表单验证
    let isValid = true;
    
    if (!formData.phone) {
      this.setData({
        'errors.phone': '请输入联系电话'
      });
      isValid = false;
    } else if (!/^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$|^(\+)?61[0-9]{9}$/.test(formData.phone)) {
      this.setData({
        'errors.phone': '请输入有效的手机号码'
      });
      isValid = false;
    }
    
    if (!formData.message) {
      this.setData({
        'errors.message': '请输入留言内容'
      });
      isValid = false;
    } else if (formData.message.length < 5) {
      this.setData({
        'errors.message': '留言内容不能少于5个字符'
      });
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    // 开始提交
    this.setData({
      submitting: true
    });
    
    // 构造请求数据
    const requestData = {
      name: formData.name || '匿名用户',
      phone: formData.phone,
      message: formData.message,
      source: this.data.source || 'contact_page'
    };
    
    // 发送请求
    wx.request({
      url: 'https://api.juwo.com/contact/submit',
      method: 'POST',
      data: requestData,
      success: (res) => {
        // 假设接口返回格式为 {code: 0, message: 'success'}
        if (res.data && res.data.code === 0) {
          // 提交成功
          this.setData({
            showSuccessModal: true,
            // 清空表单
            formData: {
              name: '',
              phone: '',
              message: ''
            }
          });
        } else {
          // 提交失败
          wx.showToast({
            title: res.data.message || '提交失败，请稍后重试',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({
          submitting: false
        });
      }
    });
  },

  /**
   * 关闭成功弹窗
   */
  closeSuccessModal: function() {
    this.setData({
      showSuccessModal: false
    });
  }
}); 