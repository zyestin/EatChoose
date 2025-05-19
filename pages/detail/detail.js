// pages/detail/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    restaurantSet: undefined,
    selectedRestaurant: undefined,
    loading: true,
    setId: '' // 存储饭店集ID，用于刷新数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.id) {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 保存ID用于后续刷新
    this.setData({
      setId: options.id
    });
    
    this.loadRestaurantSet(options.id);
  },

  /**
   * 生命周期函数--监听页面显示
   * 每次页面显示时重新加载数据，确保数据是最新的
   */
  onShow() {
    // 如果有setId，重新加载数据
    if (this.data.setId) {
      this.loadRestaurantSet(this.data.setId);
    }
  },

  /**
   * 加载饭店集数据
   */
  loadRestaurantSet(id) {
    const app = getApp();
    const set = app.getRestaurantSet(id);
    
    if (!set) {
      wx.showToast({
        title: '找不到该饭店集',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    if (set.restaurants.length === 0) {
      wx.showToast({
        title: '该饭店集为空',
        icon: 'none'
      });
    }

    // 保持已选择的饭店（如果有）
    const currentSelected = this.data.selectedRestaurant;
    let newSelected = undefined;
    
    // 如果之前有选择的饭店，尝试在新数据中找到它
    if (currentSelected) {
      newSelected = set.restaurants.find(r => r.id === currentSelected.id);
      // 如果找不到（可能被删除了），则清除选择
      if (!newSelected) {
        wx.showToast({
          title: '所选饭店已被移除',
          icon: 'none'
        });
      }
    }

    this.setData({
      restaurantSet: set,
      selectedRestaurant: newSelected,
      loading: false
    });
  },

  // 随机选择一家饭店
  onRandomSelect() {
    const { restaurantSet } = this.data;
    if (!restaurantSet || restaurantSet.restaurants.length === 0) {
      wx.showToast({
        title: '没有可选择的饭店',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在选择...',
      mask: true
    });

    // 添加一个小延迟，提供更好的用户体验
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * restaurantSet.restaurants.length);
      const selected = restaurantSet.restaurants[randomIndex];

      this.setData({
        selectedRestaurant: selected
      });

      wx.hideLoading();
    }, 500);
  },

  // 换一家（重新随机选择）
  onRandomAgain() {
    const { restaurantSet, selectedRestaurant } = this.data;
    if (!restaurantSet || restaurantSet.restaurants.length <= 1) {
      wx.showToast({
        title: '没有其他选择了',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '换一家...',
      mask: true
    });

    // 添加一个小延迟，提供更好的用户体验
    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * restaurantSet.restaurants.length);
      } while (restaurantSet.restaurants[randomIndex].id === selectedRestaurant?.id);

      const selected = restaurantSet.restaurants[randomIndex];
      this.setData({
        selectedRestaurant: selected
      });

      wx.hideLoading();
    }, 500);
  },

  /**
   * 编辑饭店集
   */
  onEdit() {
    const { restaurantSet } = this.data;
    if (!restaurantSet) return;

    wx.navigateTo({
      url: `/pages/create/create?id=${restaurantSet.id}`
    });
  }
});