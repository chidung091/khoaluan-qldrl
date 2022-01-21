import { Module } from '@nestjs/common'
import { WebhookService } from './webhook.service'
import { WebhookController } from './webhook.controller'
import { ClassModule } from '../class/class.module'

@Module({
  imports: [ClassModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
