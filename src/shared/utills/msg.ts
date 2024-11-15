import Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { config } from 'dotenv';
import { getEnvConfig } from '.';

config({
  path: getEnvConfig(),
});

const conf = new $OpenApi.Config({
  // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
  accessKeyId: process.env.ACCESS_KEY_ID,
  // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
});
// Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
conf.endpoint = `dysmsapi.aliyuncs.com`;
export const client = new Dysmsapi20170525(conf);
