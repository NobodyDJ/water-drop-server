import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import OSS from 'ali-oss';
import { STS } from 'ali-oss';
import { OSSType } from './dto/oss.type';

@Injectable()
export class OSSService {
  async getSignature(): Promise<OSSType> {
    const config = {
      // 从环境变量中获取RAM用户的访问密钥和目标RAM角色的Arn.
      // region填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: 'oss-cn-shanghai',
      // 指定Bucket名称。
      bucket: 'water-drop-assets-dj',
      dir: 'images/',
    };
    const { accessKeyId, accessKeySecret, roleArn } = config;
    const seconds = 3000; //3000秒，50分钟过期
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    const policy = {
      expiration: date.toISOString(), // 请求有效期。
      conditions: [
        ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制。
      ],
    };
    /* 使用stsToken上传。 */
    let stsToken;
    if (roleArn) {
      const sts = new STS({
        accessKeyId,
        accessKeySecret,
      });
      const {
        credentials: { AccessKeyId, AccessKeySecret, SecurityToken },
      } = await sts.assumeRole(roleArn, '', seconds, 'sessiontest');
      stsToken = SecurityToken;
      const client = new OSS({
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken,
      });
      // 计算签名。
      const formData = await client.calculatePostSignature(policy);

      // 返回参数。
      const params = {
        expire: dayjs(date).unix().toString(),
        policy: formData.policy,
        signature: formData.Signature,
        accessId: formData.OSSAccessKeyId,
        stsToken,
      };
      return params;
    }
  }
}
