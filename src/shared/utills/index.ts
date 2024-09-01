import { NOT_EMPTY, SUCCESS, VALIDATE_ERROR } from '@/common/constants/code';
import { Result } from '@/dto/result.type';

export const accountAndPwdValidate = (
  account: string,
  password: string,
): Result => {
  if (!account || !password) {
    return {
      code: NOT_EMPTY,
      message: '账号或者密码不能为空',
    };
  }
  if (!/^(?![0-9]+$)(?![a-z]+$)[a-z0-9]{6,10}$/.test(account)) {
    return {
      code: VALIDATE_ERROR,
      message: '账号校验失败，请重新输入账号',
    };
  }
  return {
    code: SUCCESS,
  };
};

export const getRandomCode = () => {
  const code = [];
  for (let i = 0; i < 4; i++) {
    code.push(Math.floor(Math.random() * 9));
  }
  return code.join('');
};
