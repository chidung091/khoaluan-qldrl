import { Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Class, ClassDocument } from './class.schema'
import { ClassResponse } from './dto/class.response.dto'
import { CreateClass } from './dto/create-class.dto'
import { FindClassIdDto } from './dto/find-classId.dto'
import { FindClassIdsDto } from './dto/find-classIds.dto'
import { FindHeadMasterClassDto } from './dto/find-headmaster-class.dto'
import { FindStudentListByMonitor } from './dto/find-student-headmaster.dto'

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) readonly model: Model<ClassDocument>,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  async createClass(dto: CreateClass) {
    try {
      const classCreate = (
        await this.model.create({
          ...dto,
        })
      ).toObject()

      return this.mapper.map(classCreate, ClassResponse, Class)
    } catch (error) {
      throw error
    }
  }

  async findClass(dto: FindClassIdsDto) {
    const data = await this.model
      .find({ classId: dto.classIds })
      .lean({ virtuals: true })
    return this.mapper.mapArray(data, ClassResponse, Class)
  }

  async findClassDetail(dto: FindClassIdDto) {
    const data = await this.model.findOne({ classId: dto.classId })
    return data
  }

  async findClassByHeadMasterInYear(dto: FindHeadMasterClassDto) {
    const data = await this.model.find({
      $and: [
        { 'students.headMasterId': dto.headMasterId },
        { 'students.startYear': dto.startYear },
        { 'students.endYear': dto.endYear },
        { 'students.semester': dto.semester },
      ],
    })
    const dataResponse = []
    await Promise.all(
      data.map(async (arrayItem) => {
        dataResponse.push(arrayItem.classId)
      }),
    )
    return dataResponse
  }

  async findStudentListByMonitor(dto: FindStudentListByMonitor) {
    const data = await this.model.findOne({
      $and: [
        { 'students.startYear': dto.startYear },
        { 'students.endYear': dto.endYear },
        { 'students.monitorId': dto.monitorId },
        { 'students.semester': dto.semester },
      ],
    })
    const dataStudentsIds = data.students.find((student) => {
      return (
        student.startYear === dto.startYear &&
        student.endYear === dto.endYear &&
        student.monitorId === dto.monitorId &&
        student.semester === dto.semester
      )
    })
    return dataStudentsIds.studentsIds
  }
}
