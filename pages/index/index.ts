// index.ts
interface IPageData {
  restaurantSets: IRestaurantSet[];
}

Page<IPageData>({
  data: {
    restaurantSets: []
  },

  onLoad() {
    this.loadRestaurantSets();
  },

  onShow() {
    this.loadRestaurantSets();
  },

  // 加载饭店集列表
  loadRestaurantSets() {
    const app = getApp<IAppOption>();
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
  onSetTap(e: any) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 删除饭店集
  onDeleteTap(e: any) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个饭店集吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp<IAppOption>();
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
});