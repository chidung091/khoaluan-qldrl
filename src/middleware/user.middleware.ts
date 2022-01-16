import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { Request } from 'express';
import {
  ACCESS_TOKEN_HEADER_NAME,
  EXCLUDED_USER_MIDDLEWARE_ROUTES,
} from 'src/common/constant';
import { IJwtPayload } from 'src/common/interfaces';
import { decodeJWTToken } from 'src/common/utils';
import { configService } from 'src/modules/shared/services';

const baseUrl = configService.serviceBaseUrl;

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req, res, next) {
    const routeIsExcluded = EXCLUDED_USER_MIDDLEWARE_ROUTES.some(
      (excludedRoute: RouteInfo) => {
        return (
          req.originalUrl === `${baseUrl}${excludedRoute.path}` &&
          (excludedRoute.method === RequestMethod[req.method as string] ||
            req.method === RequestMethod.ALL)
        );
      },
    );

    if (!routeIsExcluded) {
      req.user = await this.getUserSession(req);
    }

    next();
  }

  async getUserSession(req: Request): Promise<Partial<IJwtPayload> | null> {
    if (req.headers['x-api-user-id']) {
      return { sub: req.headers['x-api-user-id'] as unknown as string };
    }

    const accessToken = req.get(ACCESS_TOKEN_HEADER_NAME);

    if (!accessToken) {
      return;
    }

    return decodeJWTToken(accessToken.replace('Bearer ', '')) as IJwtPayload;
  }
}
