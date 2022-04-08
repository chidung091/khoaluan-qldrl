import { Body, Controller, Post } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { ClassService } from './class.service'
import { CreateClass } from './dto/create-class.dto'
import { FindClassIdDto } from './dto/find-classId.dto'
import { FindClassIdsDto } from './dto/find-classIds.dto'
import { FindHeadMasterClassDto } from './dto/find-headmaster-class.dto'
import { FindHeadMasterStudentListIdDto } from './dto/find-headmaster-student-id.dto'
import { FindHeadMasterStudentListDto } from './dto/find-headmaster-student.dto'
import { FindStudentListByMonitorWithId } from './dto/find-monitor-student-id.dto'
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

  @MessagePattern({ role: 'class', cmd: 'get-class-id-headmaster' })
  async getClassHeadMasterList(@Body() dto: FindHeadMasterClassDto) {
    return this.classService.findClassByHeadMasterInYear(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-class-id-monitor' })
  async getClassMonitorList(@Body() dto: FindStudentListByMonitor) {
    return this.classService.findClassByMonitorInYear(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-student-list-headmaster' })
  async getStudentHeadMaster(@Body() dto: FindHeadMasterStudentListIdDto) {
    return this.classService.findStudentListByHeadMasterSearch(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-student-list-monitor' })
  async getStudentMonitor(@Body() dto: FindStudentListByMonitorWithId) {
    return this.classService.findStudentListByMonitorSearch(dto)
  }

  @MessagePattern({ role: 'class', cmd: 'get-class-monitor' })
  async getStudentMonitorList(@Body() dto: FindStudentListByMonitor) {
    return this.classService.findStudentListByMonitor(dto)
  }
}
