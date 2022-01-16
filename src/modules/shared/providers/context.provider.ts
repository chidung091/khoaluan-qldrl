import httpContext from 'express-http-context';
import {
  HttpContextProperties,
  UserDataJwtProperties,
} from 'src/common/constant';
import { IJwtPayload } from 'src/common/interfaces';

export class ContextProvider {
  static setUserId(userId: string) {
    return httpContext.set(HttpContextProperties.USER_ID, userId);
  }

  static setUserData(userData: IJwtPayload) {
    return httpContext.set(HttpContextProperties.USER, userData);
  }

  static setAccessToken(token: string) {
    return httpContext.set(HttpContextProperties.ACCESS_TOKEN, token);
  }

  static getUserId() {
    return httpContext.get(HttpContextProperties.USER_ID);
  }

  static getAccessToken() {
    return httpContext.get(HttpContextProperties.ACCESS_TOKEN);
  }

  static getUserData(key?: keyof IJwtPayload) {
    if (!key) {
      return httpContext.get(HttpContextProperties.USER);
    }

    if (key === UserDataJwtProperties.USER_TYPE) {
      return (httpContext.get(HttpContextProperties.USER) as IJwtPayload)[
        key
      ][0];
    }

    return httpContext.get(HttpContextProperties.USER)
      ? (httpContext.get(HttpContextProperties.USER) as IJwtPayload)[key]
      : null;
  }
}
