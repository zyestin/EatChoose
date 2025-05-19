/// <reference path="./wx/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    restaurantSets: IRestaurantSet[]
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

// 饭店集接口定义
interface IRestaurantSet {
  id: string;
  name: string;
  restaurants: IRestaurant[];
  createTime: number;
  updateTime: number;
}

// 饭店接口定义
interface IRestaurant {
  id: string;
  name: string;
  tags?: string[];
}