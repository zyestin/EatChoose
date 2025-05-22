// pages/create/create.js
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    setName: '',
    newRestaurant: '',
    restaurants: [],
    canSave: false,
    isEdit: false,
    setId: ''
  },

  onLoad(options) {
    if (options && options.id) {
      const set = app.getRestaurantSet(options.id);
      if (set) {
        this.setData({
          setId: set.id,
          setName: set.name,
          restaurants: set.restaurants,
          isEdit: true,
          canSave: true
        });
      }
    }
  },

  onSetNameInput(e) {
    const setName = e.detail.value;
    this.setData({
      setName,
      canSave: setName && this.data.restaurants.length > 0
    });
  },

  onRestaurantInput(e) {
    this.setData({
      newRestaurant: e.detail.value
    });
  },

  onAddRestaurant() {
    const { newRestaurant, restaurants } = this.data;
    if (!newRestaurant) return;

    const exists = restaurants.some(r => r.name === newRestaurant);
    if (exists) {
      wx.showToast({
        title: '该饭店已存在',
        icon: 'none'
      });
      return;
    }

    const newRestaurants = [...restaurants, {
      id: util.generateUUID(),
      name: newRestaurant
    }];

    this.setData({
      restaurants: newRestaurants,
      newRestaurant: '',
      canSave: this.data.setName && newRestaurants.length > 0
    });
  },

  onDeleteRestaurant(e) {
    const { index } = e.currentTarget.dataset;
    const newRestaurants = [...this.data.restaurants];
    newRestaurants.splice(index, 1);

    this.setData({
      restaurants: newRestaurants,
      canSave: this.data.setName && newRestaurants.length > 0
    });
  },

  async onSave() {
    const { setName, restaurants, canSave, isEdit, setId } = this.data;
    if (!canSave) return;

    wx.showLoading({
      title: isEdit ? '更新中...' : '创建中...',
      mask: true
    });

    try {
      const set = {
        id: isEdit ? setId : util.generateUUID(),
        name: setName,
        restaurants
      };

      if (isEdit) {
        await app.updateRestaurantSet(set);
      } else {
        await app.addRestaurantSet(set);
      }

      wx.hideLoading();
      wx.showToast({
        title: isEdit ? '更新成功' : '创建成功',
        icon: 'success'
      });

      // 保存成功后跳转到profile页面
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/profile/profile'
        });
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      });
      console.error('保存失败:', error);
    }
  }
})