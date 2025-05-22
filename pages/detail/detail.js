// pages/detail/detail.js
const app = getApp();

Page({
  data: {
    restaurantSet: null,
    selectedRestaurant: null,
    loading: true
  },

  onLoad(options) {
    if (!options.id) {
      this.showError('参数错误');
      return;
    }
    this.loadData(options.id);
  },

  loadData(id) {
    const set = app.getRestaurantSet(id);
    if (!set) {
      this.showError('找不到该饭店集');
      return;
    }
    this.setData({
      restaurantSet: set,
      loading: false
    });
  },

  showError(msg) {
    wx.showToast({ title: msg, icon: 'error' });
    setTimeout(() => wx.navigateBack(), 1500);
  },

  // 编辑饭店集
  onEdit() {
    const { restaurantSet } = this.data;
    console.log("restaurantSet:", restaurantSet);
    if (!restaurantSet) return;
    
    wx.navigateTo({
      url: `/pages/create/create?id=${restaurantSet.id}`
    });
  },

  // 随机选择一家饭店
  onRandomSelect() {
    const { restaurantSet } = this.data;
    if (!restaurantSet || restaurantSet.restaurants.length === 0) {
      wx.showToast({ title: '没有可选择的饭店', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在选择...', mask: true });
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * restaurantSet.restaurants.length);
      this.setData({
        selectedRestaurant: restaurantSet.restaurants[randomIndex]
      });
      wx.hideLoading();
    }, 500);
  },

  // 换一家
  onRandomAgain() {
    const { restaurantSet, selectedRestaurant } = this.data;
    if (!restaurantSet || restaurantSet.restaurants.length <= 1) {
      wx.showToast({ title: '没有其他选择了', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '换一家...', mask: true });
    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * restaurantSet.restaurants.length);
      } while (restaurantSet.restaurants[randomIndex].id === selectedRestaurant?.id);
      
      this.setData({
        selectedRestaurant: restaurantSet.restaurants[randomIndex]
      });
      wx.hideLoading();
    }, 500);
  },

  // 公开/发布饭店集
  onPublish() {
    const { restaurantSet } = this.data;
    if (!restaurantSet) return;
    wx.showLoading({ title: '正在公开...' });
    const updatedSet = {
      ...restaurantSet,
      isPublic: true,
      publishTime: new Date(),
      publisherInfo: app.globalData.userInfo || { nickName: '匿名用户' }
    };
    app.updateRestaurantSet(updatedSet).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '已公开', icon: 'success' });
      // 重新加载数据，刷新页面
      this.setData({ restaurantSet: updatedSet });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '公开失败', icon: 'none' });
      console.error('公开失败:', err);
    });
  }
})