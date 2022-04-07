import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { firstValueFrom } from 'rxjs'
import { ClassService } from '../class/class.service'
import { CreateMarkMonitorDto } from './dto/create-mark-monitor.dto'
import { CreateMarkTeacherDto } from './dto/create-mark-teacher.dto'
import { CreateMark } from './dto/create-mark.dto'
import { IMark, ITimeResponse } from './mark.interface'
import { Marks, MarksDocument } from './mark.schema'

@Injectable()
export class MarkService {
  constructor(
    @Inject('RATING_CLIENT')
    private readonly client: ClientProxy,
    @InjectModel(Marks.name) readonly model: Model<MarksDocument>,
    private classService: ClassService,
  ) {}

  async createMark(userID: number, dto: CreateMark) {
    const data = await this.classService.findClassByStudentId(userID)
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const findClassMark = await this.model.findOne({
      $and: [
        { classId: data.classId },
        { startYear: res.startYear },
        { endYear: res.endYear },
        { semester: res.semester },
      ],
    })
    if (!findClassMark) {
      const dataSave = await this.createNewMark(
        data.classId,
        res.semester,
        res.startYear,
        res.endYear,
      )
      const newData = {
        classId: dataSave.classId,
        semester: dataSave.semester,
        startYear: dataSave.startYear,
        endYear: dataSave.endYear,
        markDetail: [
          {
            studentId: userID,
            totalPoint: 0,
            pointList: dto.pointList,
          },
        ],
      }
      const updateDataSave = await this.model.findByIdAndUpdate(
        dataSave.id,
        newData,
        { new: true },
      )
      return updateDataSave
    }
    if (findClassMark.markDetail.find((x) => x.studentId === userID)) {
      const currentMark = findClassMark.markDetail.find(
        (x) => x.studentId === userID,
      )
      const newArray = findClassMark.markDetail.filter(
        (x) => x.studentId !== userID,
      )
      const newMarkDetail = {
        studentId: currentMark.studentId,
        totalPoint: 0,
        pointList: dto.pointList,
      }
      newArray.push(newMarkDetail)
      const newData = {
        classId: findClassMark.classId,
        semester: findClassMark.semester,
        startYear: findClassMark.startYear,
        endYear: findClassMark.endYear,
        markDetail: newArray,
      }
      const updateDataSave = await this.model.findByIdAndUpdate(
        findClassMark.id,
        newData,
        { new: true },
      )
      return updateDataSave
    }
    const newMarkDetail = {
      studentId: userID,
      totalPoint: 0,
      pointList: dto.pointList,
    }
    const newArray = findClassMark.markDetail
    newArray.push(newMarkDetail)
    const newData = {
      classId: findClassMark.classId,
      semester: findClassMark.semester,
      startYear: findClassMark.startYear,
      endYear: findClassMark.endYear,
      markDetail: newArray,
    }
    const updateDataSave = await this.model.findByIdAndUpdate(
      findClassMark.id,
      newData,
      { new: true },
    )
    return updateDataSave
  }

  async createMarkTeacher(
    classId: number,
    studentId: number,
    dto: CreateMarkTeacherDto,
  ) {
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const findClassMark = await this.model.findOne({
      $and: [
        { classId: classId },
        { startYear: res.startYear },
        { endYear: res.endYear },
        { semester: res.semester },
      ],
    })
    if (!findClassMark) {
      const dataSave = await this.createNewMark(
        classId,
        res.semester,
        res.startYear,
        res.endYear,
      )
      const newData = {
        classId: dataSave.classId,
        semester: dataSave.semester,
        startYear: dataSave.startYear,
        endYear: dataSave.endYear,
        markDetail: [
          {
            studentId: studentId,
            totalPoint: 0,
            pointList: dto.pointList,
          },
        ],
      }
      const updateDataSave = await this.model.findByIdAndUpdate(
        dataSave.id,
        newData,
        { new: true },
      )
      return updateDataSave
    }
    if (findClassMark.markDetail.find((x) => x.studentId === studentId)) {
      const currentMark = findClassMark.markDetail.find(
        (x) => x.studentId === studentId,
      )
      const newArray = findClassMark.markDetail.filter(
        (x) => x.studentId !== studentId,
      )
      const newMarkDetail = {
        studentId: currentMark.studentId,
        totalPoint: 0,
        pointList: dto.pointList,
      }
      newArray.push(newMarkDetail)
      const newData = {
        classId: findClassMark.classId,
        semester: findClassMark.semester,
        startYear: findClassMark.startYear,
        endYear: findClassMark.endYear,
        markDetail: newArray,
      }
      const updateDataSave = await this.model.findByIdAndUpdate(
        findClassMark.id,
        newData,
        { new: true },
      )
      return updateDataSave
    }
    const newMarkDetail = {
      studentId: studentId,
      totalPoint: 0,
      pointList: dto.pointList,
    }
    const newArray = findClassMark.markDetail
    newArray.push(newMarkDetail)
    const newData = {
      classId: findClassMark.classId,
      semester: findClassMark.semester,
      startYear: findClassMark.startYear,
      endYear: findClassMark.endYear,
      markDetail: newArray,
    }
    const updateDataSave = await this.model.findByIdAndUpdate(
      findClassMark.id,
      newData,
      { new: true },
    )
    return updateDataSave
  }

  async createMarkMonitor(
    classId: number,
    studentId: number,
    dto: CreateMarkMonitorDto,
  ) {
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const findClassMark = await this.model.findOne({
      $and: [
        { classId: classId },
        { startYear: res.startYear },
        { endYear: res.endYear },
        { semester: res.semester },
      ],
    })
    if (!findClassMark) {
      const dataSave = await this.createNewMark(
        classId,
        res.semester,
        res.startYear,
        res.endYear,
      )
      const newData = {
        classId: dataSave.classId,
        semester: dataSave.semester,
        startYear: dataSave.startYear,
        endYear: dataSave.endYear,
        markDetail: [
          {
            studentId: studentId,
            totalPoint: 0,
            pointList: dto.pointList,
          },
        ],
      }
      const updateDataSave = await this.model.findByIdAndUpdate(
        dataSave.id,
        newData,
        { new: true },
      )
      return updateDataSave
    }
    if (findClassMark.markDetail.find((x) => x.studentId === studentId)) {
      const currentMark = findClassMark.markDetail.find(
        (x) => x.studentId === studentId,
      )
      const newArray = findClassMark.markDetail.filter(
        (x) => x.studentId !== studentId,
      )
      const newMarkDetail = {
        studentId: currentMark.studentId,
        totalPoint: 0,
        pointList: dto.pointList,
      }
      newArray.push(newMarkDetail)
      const newData = {
        classId: findClassMark.classId,
        semester: findClassMark.semester,
        startYear: findClassMark.startYear,
        endYear: findClassMark.endYear,
        markDetail: newArray,
      }
      const updateDataSave = await this.model.findByIdAndUpdate(
        findClassMark.id,
        newData,
        { new: true },
      )
      return updateDataSave
    }
    const newMarkDetail = {
      studentId: studentId,
      totalPoint: 0,
      pointList: dto.pointList,
    }
    const newArray = findClassMark.markDetail
    newArray.push(newMarkDetail)
    const newData = {
      classId: findClassMark.classId,
      semester: findClassMark.semester,
      startYear: findClassMark.startYear,
      endYear: findClassMark.endYear,
      markDetail: newArray,
    }
    const updateDataSave = await this.model.findByIdAndUpdate(
      findClassMark.id,
      newData,
      { new: true },
    )
    return updateDataSave
  }

  private async createNewMark(
    classId: number,
    semester: number,
    startYear: number,
    endYear: number,
  ) {
    const classMark: IMark = {
      classId: classId,
      semester: semester,
      startYear: startYear,
      endYear: endYear,
    }
    return this.model.create(classMark)
  }
}
