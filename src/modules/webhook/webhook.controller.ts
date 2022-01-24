import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ClassResponse } from '../class/dto/class.response.dto'
import { CreateClass } from '../class/dto/create-class.dto'
import { FindClassIdDto } from '../class/dto/find-classId.dto'
import { FindClassIdsDto } from '../class/dto/find-classIds.dto'
import { FindHeadMasterClassDto } from '../class/dto/find-headmaster-class.dto'
import { FindHeadMasterStudentListDto } from '../class/dto/find-headmaster-student.dto'
import { FindStudentListByMonitor } from '../class/dto/find-student-headmaster.dto'
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

  @Post('/class/head-master')
  @ApiHeader({
    name: 'api-key',
    description: 'Api key',
  })
  async getClassHeadMaster(@Body() dto: FindHeadMasterClassDto) {
    return this.webhookService.findClassForHeadMaster(dto)
  }

  @Post('/student/monitor-list')
  @ApiHeader({
    name: 'api-key',
    description: 'Api key',
  })
  async getStudentMonitorList(@Body() dto: FindStudentListByMonitor) {
    return this.webhookService.findListStudentForMonitor(dto)
  }

  @Post('/student/head-master-list')
  @ApiHeader({
    name: 'api-key',
    description: 'Api key',
  })
  async getStudentHeadMasterList(@Body() dto: FindHeadMasterStudentListDto) {
    return this.webhookService.findListStudentForHeadMaster(dto)
  }
}
