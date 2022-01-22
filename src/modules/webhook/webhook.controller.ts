import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ClassResponse } from '../class/dto/class.response.dto'
import { CreateClass } from '../class/dto/create-class.dto'
import { FindClassIdDto } from '../class/dto/find-classId.dto'
import { FindClassIdsDto } from '../class/dto/find-classIds.dto'
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

  @Post('/class')
  @ApiHeader({
    name: 'api-key',
    description: 'Api key',
  })
  async getClass(@Body() dto: FindClassIdsDto) {
    return this.webhookService.findClass(dto)
  }

  @Post('/class-detail')
  @ApiHeader({
    name: 'api-key',
    description: 'Api key',
  })
  async getClassDetail(@Body() dto: FindClassIdDto) {
    return this.webhookService.findClassById(dto)
  }
}
