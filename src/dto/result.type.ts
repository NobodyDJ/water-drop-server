/* eslint-disable @typescript-eslint/no-unused-vars */

import { Page } from './page.type';

// 接口数据结构规范
interface IResult<T> {
  code: number;
  message: string;
  data?: T;
}

interface IResults<T> {
  code: number;
  message: string;
  data?: T[];
  page?: Page;
}
