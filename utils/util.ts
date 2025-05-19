/**
 * 格式化时间
 * @param date 日期对象
 * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 */
export const formatTime = (date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formatNumber = (n: number) => {
    return n.toString().padStart(2, '0');
  };

  return format
    .replace('YYYY', year.toString())
    .replace('MM', formatNumber(month))
    .replace('DD', formatNumber(day))
    .replace('HH', formatNumber(hour))
    .replace('mm', formatNumber(minute))
    .replace('ss', formatNumber(second));
};

/**
 * 生成唯一ID
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * 从数组中随机选择一个元素
 * @param array 数组
 */
export const randomChoice = <T>(array: T[]): T | null => {
  if (!array || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 等待时间（毫秒）
 */
export const debounce = (func: Function, wait: number = 300): Function => {
  let timeout: number | null = null;
  return function(this: any, ...args: any[]) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};