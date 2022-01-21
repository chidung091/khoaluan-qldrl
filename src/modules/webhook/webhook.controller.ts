import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ClassResponse } from '../class/dto/class.response.dto'
import { CreateClass } from '../class/dto/create-class.dto'
import { WebhookService } from './webhook.service'

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/class/create')
  @ApiHeader({
    name: 'api-key',
    description: 'Api key',
  })
  @ApiBody({
    type: CreateClass,
  })
  @ApiOkResponse({ type: ClassResponse })
  async create(@Body() dto: CreateClass) {
    return this.webhookService.createClass(dto)
  }
}
