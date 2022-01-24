import { Injectable } from '@nestjs/common'
import { ClassService } from '../class/class.service'
import { CreateClass } from '../class/dto/create-class.dto'
import { FindClassIdDto } from '../class/dto/find-classId.dto'
import { FindClassIdsDto } from '../class/dto/find-classIds.dto'
import { FindHeadMasterClassDto } from '../class/dto/find-headmaster-class.dto'
import { FindHeadMasterStudentListDto } from '../class/dto/find-headmaster-student.dto'
import { FindStudentListByMonitor } from '../class/dto/find-student-headmaster.dto'

@Injectable()
export class WebhookService {
  constructor(private readonly classService: ClassService) {}

  async createClass(dto: CreateClass) {
    return await this.classService.createClass(dto)
  }

  async findClass(dto: FindClassIdsDto) {
    return await this.classService.findClass(dto)
  }

  async findClassById(dto: FindClassIdDto) {
    return await this.classService.findClassDetail(dto)
  }

  async findClassForHeadMaster(dto: FindHeadMasterClassDto) {
    return await this.classService.findClassByHeadMasterInYear(dto)
  }

  async findListStudentForMonitor(dto: FindStudentListByMonitor) {
    return await this.classService.findStudentListByMonitor(dto)
  }

  async findListStudentForHeadMaster(dto: FindHeadMasterStudentListDto) {
    if (dto.classId === 0) {
      return await this.classService.findStudentListByHeadMaster(dto)
    }
    return await this.classService.findStudentListByHeadMasterWithClassId(dto)
  }
}
