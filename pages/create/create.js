// pages/create/create.js
const util = require('../../utils/util');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    setName: '',
    newRestaurant: '',
    restaurants: [],
    canSave: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 如果有id参数，表示是编辑模式
    if (options && options.id) {
      const app = getApp();
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

  /**
   * 处理饭店集名称输入
   */
  onSetNameInput(e) {
    const setName = e.detail.value;
    this.setData({
      setName,
      canSave: setName && this.data.restaurants.length > 0
    });
  },

  /**
   * 处理新饭店名称输入
   */
  onRestaurantInput(e) {
    this.setData({
      newRestaurant: e.detail.value
    });
  },

  /**
   * 添加新饭店
   */
  onAddRestaurant() {
    const { newRestaurant, restaurants } = this.data;
    if (!newRestaurant) return;

    // 检查是否已存在同名饭店
    const exists = restaurants.some(r => r.name === newRestaurant);
    if (exists) {
      wx.showToast({
        title: '该饭店已存在',
        icon: 'none'
      });
      return;
    }

    // 添加新饭店
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

  /**
   * 删除饭店
   */
  onDeleteRestaurant(e) {
    const { index } = e.currentTarget.dataset;
    const newRestaurants = [...this.data.restaurants];
    newRestaurants.splice(index, 1);

    this.setData({
      restaurants: newRestaurants,
      canSave: this.data.setName && newRestaurants.length > 0
    });
  },

  /**
   * 保存饭店集
   */
  onSave() {
    const { setName, restaurants, canSave, isEdit, setId } = this.data;
    if (!canSave) return;

    const app = getApp();
    const set = {
      id: isEdit ? setId : util.generateUUID(),
      name: setName,
      restaurants
    };

    if (isEdit) {
      app.updateRestaurantSet(set);
    } else {
      app.addRestaurantSet(set);
    }

    wx.showToast({
      title: isEdit ? '更新成功' : '创建成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
})