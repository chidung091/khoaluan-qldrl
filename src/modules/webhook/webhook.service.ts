import { Injectable } from '@nestjs/common'
import { ClassService } from '../class/class.service'
import { CreateClass } from '../class/dto/create-class.dto'
import { FindClassIdDto } from '../class/dto/find-classId.dto'
import { FindClassIdsDto } from '../class/dto/find-classIds.dto'
import { FindHeadMasterClassDto } from '../class/dto/find-headmaster-class.dto'

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
}
