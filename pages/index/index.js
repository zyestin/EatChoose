// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    restaurantSets: [],
    loading: true // 添加加载状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();
    
    // 检查数据是否已加载完成
    if (app.globalData.isDataLoaded) {
      this.loadRestaurantSets();
    } else {
      // 显示加载中
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      
      // 等待数据加载完成
      app.waitForDataLoaded().then(() => {
        wx.hideLoading();
        this.loadRestaurantSets();
      });
    }
  },

  /**
   * 数据加载完成的回调
   */
  onDataLoaded() {
    wx.hideLoading();
    this.loadRestaurantSets();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const app = getApp();
    if (app.globalData.isDataLoaded) {
      this.loadRestaurantSets();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadRestaurantSets();
    wx.stopPullDownRefresh();
  },

  // 加载饭店集列表
  loadRestaurantSets() {
    const app = getApp();
    const sets = app.getAllRestaurantSets();
    
    this.setData({
      restaurantSets: sets,
      loading: false
    });
    
    // 如果列表为空，显示提示
    if (sets.length === 0) {
      wx.showToast({
        title: '暂无饭店集，请创建',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 点击创建新的饭店集
  onCreateTap() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  // 点击饭店集
  onSetTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 删除饭店集
  onDeleteTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个饭店集吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.deleteRestaurantSet(id);
          this.loadRestaurantSets();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
})