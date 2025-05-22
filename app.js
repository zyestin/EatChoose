// app.js
App({
  globalData: {
    restaurantSets: [],
    openid: "",
    isDataLoaded: false,
    cloudEnabled: false,
  },

  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      this.loadLocalData();
      this.globalData.isDataLoaded = true;
    } else {
      wx.cloud.init({
        env: "eat-choose-cloud-6f6rreg2491cca3",
        traceUser: true,
      });
      this.initializeData();
    }
  },

  // 初始化数据
  async initializeData() {
    // 先加载本地数据，确保应用可以快速启动
    this.loadLocalData();

    try {
      // 尝试获取openid
      await this.getOpenid();

      // 如果成功获取openid，尝试加载云数据
      if (this.globalData.openid) {
        this.globalData.cloudEnabled = true;
        await this.loadCloudData();
      }
    } catch (e) {
      console.error("云同步初始化失败：", e);
      // 即使云同步失败，应用仍然可以使用本地数据
      wx.showToast({
        title: "云同步失败，使用本地数据",
        icon: "none",
        duration: 2000,
      });
    } finally {
      this.globalData.isDataLoaded = true;
      // 通知所有页面数据已加载完成
      this.notifyDataLoaded();
    }
  },

  // 通知数据加载完成
  notifyDataLoaded() {
    const pages = getCurrentPages();
    pages.forEach((page) => {
      if (page && page.onDataLoaded) {
        page.onDataLoaded();
      }
    });
  },

  // 获取用户openid
  async getOpenid() {
    try {
      console.log("正在调用云函数getOpenid...");
      const res = await wx.cloud.callFunction({
        name: "getOpenid",
      });

      console.log("云函数返回结果：", res);

      // 检查不同可能的返回格式
      let openid = null;

      // 检查格式1: result.openid
      if (res && res.result && res.result.openid) {
        openid = res.result.openid;
      }
      // 检查格式2: result.userInfo.openId
      else if (
        res &&
        res.result &&
        res.result.userInfo &&
        res.result.userInfo.openId
      ) {
        openid = res.result.userInfo.openId;
      }
      // 检查格式3: result.OPENID
      else if (res && res.result && res.result.OPENID) {
        openid = res.result.OPENID;
      }

      if (openid) {
        this.globalData.openid = openid;
        console.log("获取openid成功:", openid);
      } else {
        console.error("云函数返回结果中没有找到openid:", res);
        throw new Error("openid not found in result");
      }
    } catch (e) {
      console.error("获取openid失败：", e);
      // 显示错误信息，帮助用户排查问题
      wx.showModal({
        title: "云同步初始化失败",
        content:
          "无法获取用户标识，请检查云函数是否正确部署。错误信息：" + e.message,
        showCancel: false,
      });
      throw e;
    }
  },

  // 从云端加载数据
  async loadCloudData() {
    if (!this.globalData.openid) {
      throw new Error("openid not available");
    }

    try {
      console.log("正在从云端加载数据...");
      const db = wx.cloud.database();
      const { data } = await db
        .collection("restaurantSets")
        .where({
          _openid: this.globalData.openid,
        })
        .get();

      console.log("云端数据查询结果：", data);

      if (data && data.length > 0) {
        // 使用云端数据
        this.globalData.restaurantSets = data.map((item) => ({
          id: item._id,
          name: item.name,
          isPublic: item.isPublic,
          restaurants: item.restaurants || [],
        }));
        // 同步到本地存储
        wx.setStorageSync("restaurantSets", this.globalData.restaurantSets);
        console.log("已加载云端数据，共", data.length, "个饭店集");
      } else {
        console.log("云端没有数据，将本地数据同步到云端");
        // 如果本地有数据，同步到云端
        if (this.globalData.restaurantSets.length > 0) {
          await this.syncToCloud();
        }
      }
    } catch (e) {
      console.error("从云端加载数据失败：", e);
      throw e;
    }
  },

  // 从本地存储加载数据
  loadLocalData() {
    try {
      const storedSets = wx.getStorageSync("restaurantSets");
      if (storedSets && Array.isArray(storedSets)) {
        this.globalData.restaurantSets = storedSets;
        console.log("从本地加载数据成功，共", storedSets.length, "个饭店集");
      } else {
        // 如果本地没有数据或数据格式不正确，初始化为空数组
        this.globalData.restaurantSets = [];
        console.log("本地没有数据，初始化为空数组");
      }
    } catch (e) {
      console.error("从本地加载数据失败：", e);
      this.globalData.restaurantSets = [];
    }
  },

  // 通知数据加载完成
  notifyDataLoaded() {
    const pages = getCurrentPages();
    pages.forEach((page) => {
      if (page && page.onDataLoaded) {
        page.onDataLoaded();
      }
    });
  },

  // 修改addRestaurantSet方法
  async addRestaurantSet(set) {
    if (!set.id) {
      set.id = this.generateUUID();
    }

    // 默认设置为不公开
    if (typeof set.isPublic === "undefined") {
      set.isPublic = false;
    }

    this.globalData.restaurantSets.push(set);
    await this.saveRestaurantSets();
    return set;
  },

  // 新增方法：获取公开的饭店集
  async getPublicRestaurantSets() {
    if (!this.globalData.cloudEnabled) {
      return this.globalData.restaurantSets.filter((set) => set.isPublic);
    }

    try {
      const db = wx.cloud.database();
      const { data } = await db
        .collection("restaurantSets")
        .where({
          isPublic: true,
        })
        .get();

      return data.map((item) => ({
        id: item._id,
        name: item.name,
        restaurants: item.restaurants || [],
        isPublic: true,
      }));
    } catch (e) {
      console.error("获取公开饭店集失败：", e);
      return [];
    }
  },

  // 修改后的同步到云端方法
  async syncToCloud() {
    if (!this.globalData.openid || !this.globalData.cloudEnabled) {
      console.log("云同步未启用，跳过同步");
      return;
    }

    console.log("正在同步数据到云端...");
    const db = wx.cloud.database();

    try {
      // 获取现有的云端数据
      const { data } = await db
        .collection("restaurantSets")
        .where({
          _openid: this.globalData.openid,
        })
        .get();

      console.log("现有云端数据：", data);

      // 如果有现有数据，先删除
      if (data && data.length > 0) {
        console.log("删除现有云端数据...");
        for (const item of data) {
          await db.collection("restaurantSets").doc(item._id).remove();
        }
      }
      // 添加新数据
      console.log("添加新数据到云端...");
      for (const set of this.globalData.restaurantSets) {
        // 创建一个新对象，避免包含可能的非法字段
        const newSet = {
          name: set.name,
          isPublic: set.isPublic || false,
          restaurants: set.restaurants || [],
          createTime: db.serverDate(),
        };

        const result = await db.collection("restaurantSets").add({
          data: newSet,
        });

        // 更新本地ID为云ID
        const index = this.globalData.restaurantSets.findIndex(
          (s) => s.id === set.id
        );
        if (index !== -1) {
          this.globalData.restaurantSets[index].id = result._id;
        }
      }

      // 更新本地存储
      wx.setStorageSync("restaurantSets", this.globalData.restaurantSets);

      console.log("数据同步到云端成功");
      wx.showToast({
        title: "云同步成功",
        icon: "success",
        duration: 2000,
      });
    } catch (e) {
      console.error("同步到云端失败：", e);
      wx.showToast({
        title: "云同步失败",
        icon: "none",
        duration: 2000,
      });
    }
  },

  // 从云端刷新数据
  async refreshFromCloud() {
    if (!this.globalData.openid) {
      throw new Error("openid not available");
    }

    try {
      console.log("正在从云端刷新数据...");
      const db = wx.cloud.database();
      const { data } = await db
        .collection("restaurantSets")
        .where({
          _openid: this.globalData.openid,
        })
        .get();

      console.log("云端数据查询结果：", data);

      if (data && data.length > 0) {
        // 使用云端数据
        this.globalData.restaurantSets = data.map((item) => ({
          id: item._id,
          name: item.name,
          isPublic: item.isPublic,
          restaurants: item.restaurants || [],
        }));
        // 同步到本地存储
        wx.setStorageSync("restaurantSets", this.globalData.restaurantSets);
        console.log("已刷新云端数据，共", data.length, "个饭店集");
      } else {
        console.log("云端没有数据");
      }

      return true;
    } catch (e) {
      console.error("从云端刷新数据失败：", e);
      throw e;
    }
  },

  // 保存数据（同时保存到本地和云端）
  async saveRestaurantSets() {
    // 保存到本地
    try {
      wx.setStorageSync("restaurantSets", this.globalData.restaurantSets);
      console.log("保存数据到本地成功");
    } catch (e) {
      console.error("保存到本地失败：", e);
      wx.showToast({
        title: "保存本地数据失败",
        icon: "none",
      });
    }

    // 同步到云端
    if (this.globalData.cloudEnabled) {
      try {
        await this.syncToCloud();
      } catch (e) {
        console.error("同步到云端失败：", e);
      }
    }
  },

  // 添加新的饭店集
  async addRestaurantSet(set) {
    // 确保set有有效的id
    if (!set.id) {
      set.id = this.generateUUID();
    }

    // 添加到本地数据
    this.globalData.restaurantSets.push(set);

    // 保存数据
    await this.saveRestaurantSets();

    return set;
  },

  // 更新饭店集
  async updateRestaurantSet(set) {
    const index = this.globalData.restaurantSets.findIndex(
      (s) => s.id === set.id
    );
    if (index === -1) return false;

    // 更新本地数据
    this.globalData.restaurantSets[index] = set;

    // 保存数据
    await this.saveRestaurantSets();

    return true;
  },

  // 删除饭店集
  async deleteRestaurantSet(id) {
    const index = this.globalData.restaurantSets.findIndex((s) => s.id === id);
    if (index === -1) return false;

    // 删除本地数据
    this.globalData.restaurantSets.splice(index, 1);

    // 保存数据
    await this.saveRestaurantSets();

    return true;
  },

  // 获取饭店集
  getRestaurantSet(id) {
    return this.globalData.restaurantSets.find((s) => s.id === id);
  },

  // 获取所有饭店集
  getAllRestaurantSets() {
    return this.globalData.restaurantSets;
  },

  // 等待数据加载完成
  waitForDataLoaded() {
    if (this.globalData.isDataLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (this.globalData.isDataLoaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  },

  // 生成UUID
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  },

  // 手动触发云同步
  async manualSync() {
    if (!this.globalData.cloudEnabled) {
      // 如果云同步未启用，尝试重新初始化
      try {
        await this.getOpenid();
        this.globalData.cloudEnabled = true;
      } catch (e) {
        wx.showModal({
          title: "云同步未启用",
          content: "无法获取用户标识，请确保云函数已正确部署。",
          showCancel: false,
        });
        return;
      }
    }

    // 执行同步
    await this.syncToCloud();
  },
});
