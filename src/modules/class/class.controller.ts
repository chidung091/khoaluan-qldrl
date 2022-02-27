import { Body, Controller, Get, Post } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ClassService } from './class.service'
import { ClassResponse } from './dto/class.response.dto'
import { CreateClass } from './dto/create-class.dto'
import { FindClassIdsDto } from './dto/find-classIds.dto'

@ApiTags('class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiOkResponse({ type: ClassResponse })
  async post(@Body() dto: FindClassIdsDto) {
    return this.classService.findClass(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'create' })
  async createClass(@Body() dto: CreateClass) {
    return this.classService.createClass(dto)
  }

  @Get()
  async get() {
    return this.classService.testCallMicroservice()
  }
}
