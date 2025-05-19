// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    restaurantSets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadRestaurantSets();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadRestaurantSets();
  },

  // 加载饭店集列表
  loadRestaurantSets() {
    const app = getApp();
    const sets = app.getAllRestaurantSets();
    this.setData({
      restaurantSets: sets
    });
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