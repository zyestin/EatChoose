// pages/discover/discover.js
Page({
  data: {
    sharedSets: [],
    loading: true,
    error: false
  },

  onLoad() {
    this.loadSharedSets();
  },

  onShow() {
    this.loadSharedSets();
  },

  async onPullDownRefresh() {
    try {
      await this.loadSharedSets();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    } catch (e) {
      this.setData({ error: true });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  async loadSharedSets() {
    this.setData({ loading: true, error: false });
    try {
      const db = wx.cloud.database();
      const { data } = await db.collection('restaurantSets')
        .where({ isPublic: true })
        .orderBy('shareTime', 'desc')
        .get();

      this.setData({
        sharedSets: data,
        loading: false
      });
    } catch (e) {
      console.error('加载失败:', e);
      this.setData({ 
        loading: false,
        error: true 
      });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  onRetry() {
    this.loadSharedSets();
  },

  onSetTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
})