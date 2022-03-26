import { Body, Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { ClassService } from './class.service'
import { CreateClass } from './dto/create-class.dto'
import { FindClassIdDto } from './dto/find-classId.dto'
import { FindClassIdsDto } from './dto/find-classIds.dto'
import { FindHeadMasterStudentListDto } from './dto/find-headmaster-student.dto'
import { FindStudentListByMonitor } from './dto/find-student-headmaster.dto'

@ApiTags('class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @MessagePattern({ role: 'class', cmd: 'create' })
  async createClass(@Body() dto: CreateClass) {
    return this.classService.createClass(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'class-detail' })
  async getClassDetail(@Body() dto: FindClassIdDto) {
    return this.classService.findClassDetail(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-class' })
  async getClass(@Body() dto: FindClassIdsDto) {
    return this.classService.findClass(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-class-headmaster' })
  async getStudentHeadMasterList(@Body() dto: FindHeadMasterStudentListDto) {
    return this.classService.findStudentListByHeadMaster(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-class-monitor' })
  async getStudentMonitorList(@Body() dto: FindStudentListByMonitor) {
    return this.classService.findStudentListByMonitor(dto)
  }
}
