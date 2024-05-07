export interface Locales<T = any> {
  /** Chinese */
  zh_CN: T;
  /** English */
  en_US: T;

  th_TH: T;
}

export type Language = keyof Locales;

export interface PageData<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}
