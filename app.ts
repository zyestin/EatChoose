// app.ts
App<IAppOption>({
  globalData: {
    restaurantSets: []
  },
  
  onLaunch() {
    // 从本地存储加载饭店集数据
    try {
      const storedSets = wx.getStorageSync('restaurantSets');
      if (storedSets) {
        this.globalData.restaurantSets = storedSets;
      }
    } catch (e) {
      console.error('Failed to load restaurant sets from storage:', e);
    }
  },
  
  // 保存饭店集数据到本地存储
  saveRestaurantSets() {
    try {
      wx.setStorageSync('restaurantSets', this.globalData.restaurantSets);
    } catch (e) {
      console.error('Failed to save restaurant sets to storage:', e);
      wx.showToast({
        title: '保存数据失败',
        icon: 'none'
      });
    }
  },
  
  // 添加新的饭店集
  addRestaurantSet(set: IRestaurantSet) {
    this.globalData.restaurantSets.push(set);
    this.saveRestaurantSets();
  },
  
  // 更新饭店集
  updateRestaurantSet(set: IRestaurantSet) {
    const index = this.globalData.restaurantSets.findIndex(s => s.id === set.id);
    if (index !== -1) {
      this.globalData.restaurantSets[index] = set;
      this.saveRestaurantSets();
      return true;
    }
    return false;
  },
  
  // 删除饭店集
  deleteRestaurantSet(id: string) {
    const index = this.globalData.restaurantSets.findIndex(s => s.id === id);
    if (index !== -1) {
      this.globalData.restaurantSets.splice(index, 1);
      this.saveRestaurantSets();
      return true;
    }
    return false;
  },
  
  // 获取饭店集
  getRestaurantSet(id: string): IRestaurantSet | undefined {
    return this.globalData.restaurantSets.find(s => s.id === id);
  },
  
  // 获取所有饭店集
  getAllRestaurantSets(): IRestaurantSet[] {
    return this.globalData.restaurantSets;
  }
})