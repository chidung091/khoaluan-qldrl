import { Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { firstValueFrom } from 'rxjs'
import { ITimeResponse } from '../mark/mark.interface'
import { Class, ClassDocument } from './class.schema'
import { ClassResponse } from './dto/class.response.dto'
import { CreateClass } from './dto/create-class.dto'
import { FindClassIdDto } from './dto/find-classId.dto'
import { FindClassIdsDto } from './dto/find-classIds.dto'
import { FindHeadMasterClassDto } from './dto/find-headmaster-class.dto'
import { FindHeadMasterStudentListIdDto } from './dto/find-headmaster-student-id.dto'
import { FindHeadMasterStudentListDto } from './dto/find-headmaster-student.dto'
import { FindStudentListByMonitorWithId } from './dto/find-monitor-student-id.dto'
import { FindStudentListByMonitor } from './dto/find-student-headmaster.dto'

@Injectable()
export class ClassService {
  constructor(
    @Inject('BE_CLIENT')
    private readonly client: ClientProxy,
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

  async findClassByMonitorInYear(dto: FindStudentListByMonitor) {
    const data = await this.model.find({
      $and: [
        { 'students.monitorId': dto.monitorId },
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

  async findClassByStudentId(id: number) {
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const data = await this.model.findOne({
      $and: [
        { 'students.studentsIds': id },
        { 'students.startYear': res.startYear },
        { 'students.endYear': res.endYear },
        { 'students.semester': res.semester },
      ],
    })
    return data
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

  async findStudentListByMonitorSearch(dto: FindStudentListByMonitorWithId) {
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
    const findId = dataStudentsIds.studentsIds.find((x) => x === dto.studentId)
    if (!findId || !dto.studentId) {
      return dataStudentsIds.studentsIds
    }
    const dataResponse = [findId]
    return dataResponse
  }

  async findStudentListByHeadMaster(dto: FindHeadMasterStudentListDto) {
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
        const dataStudent = arrayItem.students
        const dataClass = arrayItem.classId
        await Promise.all(
          dataStudent.map(async (arrayI) => {
            const dataStudentsIDs = arrayI.studentsIds
            await Promise.all(
              dataStudentsIDs.map(async (arrayItemm) => {
                const data = {
                  id: arrayItemm,
                  classId: dataClass,
                }
                dataResponse.push(data)
              }),
            )
          }),
        )
      }),
    )
    return dataResponse
  }

  async findStudentAndMonitor(dto: FindHeadMasterStudentListIdDto) {
    const data = await this.model.findOne({
      $and: [
        { 'students.headMasterId': dto.headMasterId },
        { 'students.startYear': dto.startYear },
        { 'students.endYear': dto.endYear },
        { 'students.semester': dto.semester },
      ],
    })
    let dataRes = {}
    const dataStudent = data.students
    const dataClass = data.classId
    await Promise.all(
      dataStudent.map(async (arrayI) => {
        const dataStudentsIDs = arrayI.studentsIds
        const oldMonitorId = arrayI.monitorId
        const findId = dataStudentsIDs.find((x) => x === dto.studentId)
        if (!findId) {
          return 0
        }
        dataRes = {
          id: findId,
          classId: dataClass,
          oldMonitorId: oldMonitorId,
        }
      }),
    )
    return dataRes
  }

  async updateStudentAndMonitor(dto: FindHeadMasterStudentListIdDto) {
    const data = await this.model.findOne({
      $and: [
        { 'students.headMasterId': dto.headMasterId },
        { 'students.startYear': dto.startYear },
        { 'students.endYear': dto.endYear },
        { 'students.semester': dto.semester },
      ],
    })
    const dataNew = data
    const dataStudent = data.students
    await Promise.all(
      dataStudent.map(async (arrayI) => {
        const oldMonitorId = arrayI.monitorId
        const currentMark = dataStudent.find(
          (x) => x.monitorId === oldMonitorId,
        )
        const newArray = dataStudent.filter((x) => x.monitorId !== oldMonitorId)
        currentMark.monitorId = dto.studentId
        newArray.push(currentMark)
        dataNew.students = newArray
      }),
    )
    const updateDataSave = await this.model.findByIdAndUpdate(
      data.id,
      dataNew,
      { new: true },
    )
    return updateDataSave
  }

  async findStudentListByHeadMasterSearch(dto: FindHeadMasterStudentListIdDto) {
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
        const dataStudent = arrayItem.students
        const dataClass = arrayItem.classId
        await Promise.all(
          dataStudent.map(async (arrayI) => {
            const dataStudentsIDs = arrayI.studentsIds
            if (!dto.studentId) {
              await Promise.all(
                dataStudentsIDs.map(async (arrayItemm) => {
                  const data = {
                    id: arrayItemm,
                    classId: dataClass,
                  }
                  dataResponse.push(data)
                }),
              )
              return dataResponse
            }
            const findId = dataStudentsIDs.find((x) => x === dto.studentId)
            if (!findId) {
              return dataResponse
            }
            const data = {
              id: findId,
              classId: dataClass,
            }
            dataResponse.push(data)
          }),
        )
      }),
    )
    return dataResponse
  }

  async findStudentListByHeadMasterWithClassId(
    dto: FindHeadMasterStudentListDto,
  ) {
    const data = await this.model.find({
      $and: [
        { 'students.headMasterId': dto.headMasterId },
        { 'students.startYear': dto.startYear },
        { 'students.endYear': dto.endYear },
        { 'students.semester': dto.semester },
        { classId: dto.classId },
      ],
    })
    const dataResponse = []
    await Promise.all(
      data.map(async (arrayItem) => {
        const dataStudent = arrayItem.students
        const dataClass = arrayItem.classId
        await Promise.all(
          dataStudent.map(async (arrayI) => {
            const dataStudentsIDs = arrayI.studentsIds
            await Promise.all(
              dataStudentsIDs.map(async (arrayItemm) => {
                const data = {
                  id: arrayItemm,
                  classId: dataClass,
                }
                dataResponse.push(data)
              }),
            )
          }),
        )
      }),
    )
    return dataResponse
  }
}
