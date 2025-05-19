// detail.ts
interface IPageData {
  restaurantSet?: IRestaurantSet;
  selectedRestaurant?: IRestaurant;
  loading: boolean;
}

Page<IPageData>({
  data: {
    restaurantSet: undefined,
    selectedRestaurant: undefined,
    loading: true
  },

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

    const app = getApp<IAppOption>();
    const set = app.getRestaurantSet(options.id);
    
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

    this.setData({
      restaurantSet: set,
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
  }
});