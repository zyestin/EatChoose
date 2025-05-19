import { generateUUID } from '../../utils/util';

interface IPageData {
  setName: string;
  restaurants: IRestaurant[];
  newRestaurant: string;
  canSave: boolean;
}

Page<IPageData>({
  data: {
    setName: '',
    restaurants: [],
    newRestaurant: '',
    canSave: false
  },

  onLoad() {
    this.updateSaveButtonState();
  },

  // 更新保存按钮状态
  updateSaveButtonState() {
    const canSave = this.data.setName.trim() !== '' && this.data.restaurants.length > 0;
    this.setData({ canSave });
  },

  // 处理饭店集名称输入
  onSetNameInput(e: WechatMiniprogram.Input) {
    this.setData({
      setName: e.detail.value
    });
    this.updateSaveButtonState();
  },

  // 处理饭店名称输入
  onRestaurantInput(e: WechatMiniprogram.Input) {
    this.setData({
      newRestaurant: e.detail.value
    });
  },

  // 添加饭店
  onAddRestaurant() {
    const { newRestaurant, restaurants } = this.data;
    
    if (!newRestaurant.trim()) {
      wx.showToast({
        title: '请输入饭店名称',
        icon: 'none'
      });
      return;
    }

    // 检查是否已存在相同名称的饭店
    const exists = restaurants.some(r => r.name === newRestaurant.trim());
    if (exists) {
      wx.showToast({
        title: '该饭店已存在',
        icon: 'none'
      });
      return;
    }

    // 添加新饭店
    const newRestaurants = [...restaurants, {
      id: generateUUID(),
      name: newRestaurant.trim()
    }];

    this.setData({
      restaurants: newRestaurants,
      newRestaurant: ''
    });

    this.updateSaveButtonState();
  },

  // 删除饭店
  onDeleteRestaurant(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset;
    const { restaurants } = this.data;
    
    const newRestaurants = [...restaurants];
    newRestaurants.splice(index, 1);
    
    this.setData({
      restaurants: newRestaurants
    });

    this.updateSaveButtonState();
  },

  // 保存饭店集
  onSave() {
    const { setName, restaurants, canSave } = this.data;
    
    if (!canSave) {
      return;
    }

    if (!setName.trim()) {
      wx.showToast({
        title: '请输入饭店集名称',
        icon: 'none'
      });
      return;
    }

    if (restaurants.length === 0) {
      wx.showToast({
        title: '请至少添加一家饭店',
        icon: 'none'
      });
      return;
    }

    // 创建新的饭店集
    const now = Date.now();
    const newSet: IRestaurantSet = {
      id: generateUUID(),
      name: setName.trim(),
      restaurants,
      createTime: now,
      updateTime: now
    };

    // 保存到全局数据
    const app = getApp<IAppOption>();
    app.addRestaurantSet(newSet);

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
});