import { Injectable } from '@nestjs/common'
import { PORT } from './config/secrets'

@Injectable()
export class AppService {
  getHello(): string {
    return PORT
  }
}
