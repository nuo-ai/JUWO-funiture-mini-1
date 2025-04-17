const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    packageId: '',
    package: null,
    currentBannerIndex: 0,
    showCustomerServiceModal: false,
    showShareModal: false,
    expandedFaqIds: [],
    // 租期选项
    rentalOptions: [
      { id: 'week', name: '每周', multiplier: 1 },
      { id: 'month', name: '每月', multiplier: 4, discount: 0.05 },
      { id: 'quarter', name: '每季度', multiplier: 12, discount: 0.1 },
      { id: 'year', name: '每年', multiplier: 48, discount: 0.15 }
    ],
    // 当前选择的租期
    selectedRental: 'week',
    // 当前数量
    quantity: 1,
    // 计算后的价格
    calculatedPrice: 0,
    // 原价（用于显示折扣）
    originalPrice: 0,
    // 预定时间选择
    bookingDate: '',
    minDate: '',
    // 是否显示日期选择器
    showDatePicker: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        packageId: options.id
      });
      this.fetchPackageDetail(options.id);
      
      // 设置最小可选日期为明天
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = this.formatDate(tomorrow);
      this.setData({
        minDate: minDate,
        bookingDate: minDate
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
   * 格式化日期为YYYY-MM-DD格式
   */
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 获取套餐详情数据
   */
  fetchPackageDetail: function (id) {
    this.setData({ loading: true });
    
    // 尝试从API获取数据
    wx.request({
      url: `https://api.juwo.com/packages/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          // API请求成功
          const packageData = res.data.data;
          this.setData({
            package: packageData,
            loading: false
          });
          // 计算初始价格
          this.calculatePrice();
        } else {
          // API请求失败，使用本地模拟数据
          this.loadMockData(id);
        }
      },
      fail: () => {
        // 请求失败，使用本地模拟数据
        this.loadMockData(id);
      }
    });
  },

  /**
   * 加载模拟数据（当API请求失败时使用）
   */
  loadMockData: function(id) {
    // 模拟数据
    setTimeout(() => {
      const mockData = {
        id: id,
        title: id === 'studio' ? "Studio 套餐" :
               id === '1bed' ? "1房套餐" :
               id === '2bed' ? "2房套餐" : 
               "3房套餐",
        price: id === 'studio' ? 29 :
               id === '1bed' ? 33 :
               id === '2bed' ? 40 : 48,
        unit: "周",
        description: "这套家具套餐专为悉尼留学生设计，包含基础生活所需的全部家具，精选二手高品质家具，经过专业清洁和消毒处理，确保卫生安全。租期结束后可享受回购服务，省去处理家具的烦恼。",
        bannerImages: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        features: [
          { icon: "icon-quality", text: "品质保证" },
          { icon: "icon-delivery", text: "免费配送" },
          { icon: "icon-warranty", text: "专业清洁" },
          { icon: "icon-install", text: "上门安装" },
          { icon: "icon-recycle", text: "回购服务" },
          { icon: "icon-return", text: "七天退换" }
        ],
        furniture: id === 'studio' ? [
          { name: "单人床", quantity: "1件" },
          { name: "书桌", quantity: "1件" },
          { name: "书桌椅", quantity: "1把" },
          { name: "衣柜", quantity: "1个" },
          { name: "床头柜", quantity: "1个" }
        ] : id === '1bed' ? [
          { name: "双人床", quantity: "1张" },
          { name: "沙发", quantity: "1件" },
          { name: "茶几", quantity: "1个" },
          { name: "餐桌椅", quantity: "1套" },
          { name: "书桌椅", quantity: "1套" },
          { name: "衣柜", quantity: "1个" },
          { name: "床头柜", quantity: "1个" }
        ] : id === '2bed' ? [
          { name: "双人床", quantity: "2张" },
          { name: "沙发", quantity: "1件" },
          { name: "茶几", quantity: "1个" },
          { name: "餐桌椅", quantity: "1套" },
          { name: "书桌椅", quantity: "2套" },
          { name: "衣柜", quantity: "2个" },
          { name: "床头柜", quantity: "2个" }
        ] : [
          { name: "双人床", quantity: "3张" },
          { name: "沙发", quantity: "1件" },
          { name: "茶几", quantity: "1个" },
          { name: "餐桌椅", quantity: "1套" },
          { name: "书桌椅", quantity: "3套" },
          { name: "衣柜", quantity: "3个" },
          { name: "床头柜", quantity: "3个" }
        ],
        accessories: [
          { name: "电水壶", quantity: "1个" },
          { name: "窗帘", quantity: id === 'studio' ? "1套" : id === '1bed' ? "2套" : id === '2bed' ? "3套" : "4套" },
          { name: "床品四件套", quantity: id === 'studio' ? "1套" : id === '1bed' ? "1套" : id === '2bed' ? "2套" : "3套" },
          { name: "台灯", quantity: id === 'studio' ? "1个" : id === '1bed' ? "2个" : id === '2bed' ? "3个" : "4个" }
        ],
        faqs: [
          { 
            id: 1,
            question: "家具都是二手的吗？品质如何？", 
            answer: "是的，我们提供的是二手家具，但都经过严格筛选，只选品质良好的家具。每件家具都经过专业的清洁和消毒处理，确保卫生安全。" 
          },
          { 
            id: 2,
            question: "如何选择合适的套餐？", 
            answer: "您可以根据居住人数和房间数量选择：Studio套餐适合单人居住的小型公寓；1房套餐适合1-2人居住的一居室；2房套餐适合2-3人合租的两居室；3房套餐适合3-4人合租的三居室。" 
          },
          { 
            id: 3,
            question: "可以单独租某件家具吗？", 
            answer: "我们主要提供套餐服务，但也可以根据您的需求提供单件家具租赁。请联系客服了解详情和价格。" 
          },
          { 
            id: 4,
            question: "配送和安装需要多久？", 
            answer: "悉尼市区通常在确认订单后1-3天内可以完成配送和安装。郊区可能需要额外1-2天，具体以客服确认为准。" 
          },
          { 
            id: 5,
            question: "租期结束后如何处理家具？", 
            answer: "租期结束后，我们提供回购服务。只要家具无严重损坏（正常使用痕迹除外），我们将上门回收，您无需支付额外费用。" 
          }
        ],
        reviews: [
          {
            name: "Jack",
            date: "2023-09-15",
            rating: 5,
            content: "非常满意这套家具，价格实惠，品质也不错。配送很及时，师傅态度也很好。"
          },
          {
            name: "Sarah",
            date: "2023-08-22",
            rating: 4,
            content: "整体来说质量不错，价格合理，就是有些家具有轻微的使用痕迹，但可以接受。客服很负责任。"
          },
          {
            name: "李同学",
            date: "2023-07-30",
            rating: 5,
            content: "刚来悉尼留学，一下就解决了家具问题，非常方便。家具干净整洁，没有异味，很满意。"
          }
        ],
        customerService: {
          phone: "400-888-9999",
          workTime: "09:00-18:00",
          wechat: "JUWO-Service"
        }
      };

      this.setData({
        package: mockData,
        loading: false
      });
      
      // 计算初始价格
      this.calculatePrice();
    }, 1000);
  },

  /**
   * 计算价格
   */
  calculatePrice: function() {
    if (!this.data.package) return;

    const { price } = this.data.package;
    const { selectedRental, quantity, rentalOptions } = this.data;
    
    // 找到选中的租期选项
    const rentalOption = rentalOptions.find(option => option.id === selectedRental);
    
    if (!rentalOption) return;
    
    // 计算原价（不含折扣）
    const originalPrice = price * rentalOption.multiplier * quantity;
    
    // 计算折扣后的价格
    let calculatedPrice = originalPrice;
    if (rentalOption.discount) {
      calculatedPrice = originalPrice * (1 - rentalOption.discount);
    }
    
    // 更新数据
    this.setData({
      originalPrice: originalPrice.toFixed(2),
      calculatedPrice: calculatedPrice.toFixed(2)
    });
  },

  /**
   * 选择租期
   */
  selectRental: function(e) {
    const rental = e.currentTarget.dataset.rental;
    this.setData({
      selectedRental: rental
    });
    this.calculatePrice();
  },

  /**
   * 减少数量
   */
  decreaseQuantity: function() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
      this.calculatePrice();
    }
  },

  /**
   * 增加数量
   */
  increaseQuantity: function() {
    this.setData({
      quantity: this.data.quantity + 1
    });
    this.calculatePrice();
  },

  /**
   * 显示日期选择器
   */
  showDatePicker: function() {
    this.setData({
      showDatePicker: true
    });
  },

  /**
   * 日期改变
   */
  dateChange: function(e) {
    this.setData({
      bookingDate: e.detail.value
    });
  },

  /**
   * 确认日期选择
   */
  confirmDatePicker: function() {
    this.setData({
      showDatePicker: false
    });
  },

  /**
   * 取消日期选择
   */
  cancelDatePicker: function() {
    this.setData({
      showDatePicker: false
    });
  },

  /**
   * 转到预定页面
   */
  goToBooking: function() {
    if (!this.data.package) return;
    
    const { packageId, selectedRental, quantity, calculatedPrice, bookingDate } = this.data;
    
    // 构建URL参数
    const params = [
      `id=${packageId}`,
      `rental=${selectedRental}`,
      `quantity=${quantity}`,
      `price=${calculatedPrice}`,
      `date=${bookingDate}`
    ].join('&');
    
    // 跳转到预定页面
    wx.navigateTo({
      url: `/pages/booking/booking?${params}`
    });
  },

  /**
   * 轮播图切换事件
   */
  onBannerChange: function (e) {
    this.setData({
      currentBannerIndex: e.detail.current
    });
  },

  /**
   * 显示客服模态框
   */
  showCustomerService: function () {
    this.setData({
      showCustomerServiceModal: true
    });
  },

  /**
   * 关闭客服模态框
   */
  hideCustomerService: function () {
    this.setData({
      showCustomerServiceModal: false
    });
  },

  /**
   * 阻止冒泡
   */
  preventBubble: function() {
    // 什么都不做，仅用于阻止事件冒泡
    return;
  },

  /**
   * 拨打电话
   */
  makePhoneCall: function () {
    if (this.data.package && this.data.package.customerService) {
      wx.makePhoneCall({
        phoneNumber: this.data.package.customerService.phone,
        success: () => {
          this.hideCustomerService();
        }
      });
    }
  },

  /**
   * 复制微信号
   */
  copyWechat: function () {
    if (this.data.package && this.data.package.customerService) {
      wx.setClipboardData({
        data: this.data.package.customerService.wechat,
        success: () => {
          wx.showToast({
            title: '微信号已复制',
            icon: 'success'
          });
          this.hideCustomerService();
        }
      });
    }
  },

  /**
   * 显示分享模态框
   */
  showShare: function () {
    this.setData({
      showShareModal: true
    });
  },

  /**
   * 关闭分享模态框
   */
  hideShare: function () {
    this.setData({
      showShareModal: false
    });
  },

  /**
   * 分享到朋友圈
   */
  shareToMoments: function () {
    wx.showToast({
      title: '请截图后分享到朋友圈',
      icon: 'none'
    });
    this.hideShare();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (!this.data.package) return {};
    
    return {
      title: this.data.package.title,
      path: `/pages/package-detail/package-detail?id=${this.data.packageId}`,
      imageUrl: this.data.package.bannerImages[0]
    };
  },

  /**
   * 切换FAQ展开/收起状态
   */
  toggleFaq: function (e) {
    const faqId = e.currentTarget.dataset.id;
    const { expandedFaqIds } = this.data;
    const index = expandedFaqIds.indexOf(faqId);

    if (index === -1) {
      // 未展开，添加到展开列表
      expandedFaqIds.push(faqId);
    } else {
      // 已展开，从列表中移除
      expandedFaqIds.splice(index, 1);
    }

    this.setData({
      expandedFaqIds
    });
  },

  /**
   * 判断FAQ是否展开
   */
  isFaqExpanded: function (faqId) {
    return this.data.expandedFaqIds.includes(faqId);
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.packageId) {
      this.fetchPackageDetail(this.data.packageId);
      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 1000);
    } else {
      wx.stopPullDownRefresh();
    }
  }
}); 