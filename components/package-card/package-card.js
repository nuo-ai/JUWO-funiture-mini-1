Component({
  /**
   * 组件的属性列表
   */
  properties: {
    packageInfo: {
      type: Object,
      value: {}
    },
    buttonText: {
      type: String,
      value: '查看详情'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 卡片点击事件
     */
    onCardTap: function() {
      // 获取包ID并跳转到套餐详情页
      const { packageInfo } = this.data;
      if (packageInfo && packageInfo.id) {
        wx.navigateTo({
          url: `/pages/package-detail/package-detail?id=${packageInfo.id}`
        });
      }
      
      // 触发点击事件，传递套餐信息
      this.triggerEvent('cardtap', { packageInfo });
    },
    
    /**
     * 按钮点击事件
     */
    onButtonTap: function(e) {
      // 阻止事件冒泡
      e.stopPropagation();
      
      // 获取包ID并跳转到套餐详情页
      const { packageInfo } = this.data;
      if (packageInfo && packageInfo.id) {
        wx.navigateTo({
          url: `/pages/package-detail/package-detail?id=${packageInfo.id}`
        });
      }
      
      // 触发按钮点击事件，传递套餐信息
      this.triggerEvent('buttontap', { packageInfo });
    }
  }
}); 