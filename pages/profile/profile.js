// pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    restaurantSets: [],
    loading: true
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
      }).catch(err => {
        console.error('等待数据加载失败:', err);
        wx.hideLoading();
        this.loadRestaurantSets();
      });
    }
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
  async onPullDownRefresh() {
    try {
      const app = getApp();
      await app.refreshFromCloud();
      this.loadRestaurantSets();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    } catch (e) {
      console.error('刷新失败：', e);
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  // 加载饭店集列表
  loadRestaurantSets() {
    const app = getApp();
    const sets = app.getAllRestaurantSets();
    
    this.setData({
      restaurantSets: sets,
      loading: false
    });
    
    if (sets.length === 0) {
      wx.showToast({
        title: '暂无饭店集，请创建',
        icon: 'none',
        duration: 2000
      });
    }
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