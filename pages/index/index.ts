import { formatTime } from '../../utils/util';

interface IPageData {
  restaurantSets: Array<IRestaurantSet & { updateTimeStr: string }>;
}

Page<IPageData>({
  data: {
    restaurantSets: []
  },

  onLoad() {
    this.loadRestaurantSets();
  },

  onShow() {
    // 每次显示页面时重新加载数据
    this.loadRestaurantSets();
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.loadRestaurantSets();
    wx.stopPullDownRefresh();
  },

  loadRestaurantSets() {
    const app = getApp<IAppOption>();
    const sets = app.getAllRestaurantSets();
    
    // 添加格式化的时间字符串
    const setsWithTime = sets.map(set => ({
      ...set,
      updateTimeStr: formatTime(new Date(set.updateTime), 'MM-DD HH:mm')
    }));

    // 按更新时间倒序排序
    setsWithTime.sort((a, b) => b.updateTime - a.updateTime);

    this.setData({
      restaurantSets: setsWithTime
    });
  },

  onCreateTap() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  onSetTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  onDeleteTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个饭店集吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp<IAppOption>();
          if (app.deleteRestaurantSet(id)) {
            // 删除成功后重新加载数据
            this.loadRestaurantSets();
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            });
          }
        }
      }
    });
  }
});