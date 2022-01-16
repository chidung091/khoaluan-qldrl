import { Global, Module } from '@nestjs/common'
import { ConfigService, HttpUtilsService } from './services'

@Global()
@Module({
  imports: [],
  providers: [HttpUtilsService, ConfigService],
  exports: [HttpUtilsService, ConfigService],
})
export class SharedModule {}
