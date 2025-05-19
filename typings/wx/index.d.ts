declare namespace WechatMiniprogram {
  interface UserInfo {
    nickName: string;
    avatarUrl: string;
    gender: number;
    country: string;
    province: string;
    city: string;
    language: string;
  }

  interface GetUserInfoSuccessCallback {
    (res: { userInfo: UserInfo }): void;
  }

  interface SystemInfo {
    brand: string;
    model: string;
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    statusBarHeight: number;
    language: string;
    version: string;
    system: string;
    platform: string;
    SDKVersion: string;
  }
}

declare interface Wx {
  login(options: { success: (res: { code: string }) => void }): void;
  getUserInfo(options: { success: (res: { userInfo: WechatMiniprogram.UserInfo }) => void }): void;
  showToast(options: { title: string; icon?: string; duration?: number }): void;
  showLoading(options: { title: string; mask?: boolean }): void;
  hideLoading(): void;
  showModal(options: { 
    title: string; 
    content: string; 
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
    success: (res: { confirm: boolean; cancel: boolean }) => void 
  }): void;
  navigateTo(options: { url: string }): void;
  navigateBack(options?: { delta?: number }): void;
  redirectTo(options: { url: string }): void;
  setStorageSync(key: string, data: any): void;
  getStorageSync(key: string): any;
  getSystemInfo(options: { success: (res: WechatMiniprogram.SystemInfo) => void }): void;
  createSelectorQuery(): any;
}

declare const wx: Wx;

declare function App<T extends IAppOption>(app: T): void;
declare function Page(page: any): void;
declare function Component(component: any): void;
declare function getApp<T extends IAppOption>(): T;
declare function getCurrentPages(): any[];