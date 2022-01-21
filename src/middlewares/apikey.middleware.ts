import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { API_KEY } from 'src/config/secrets'

@Injectable()
export class ApikeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.headers['api-key'] !== API_KEY) {
      throw new UnauthorizedException(ApikeyMiddleware.name, 'invalid api-key')
    }
    next()
  }
}
