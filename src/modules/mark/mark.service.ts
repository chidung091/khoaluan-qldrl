import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { Model } from 'mongoose'
import { firstValueFrom } from 'rxjs'
import { ClassService } from '../class/class.service'
import { Category } from '../rating-pages/rating-pages.enum'
import { RatingPagesService } from '../rating-pages/rating-pages.service'
import { CreateMarkMonitorDto } from './dto/create-mark-monitor.dto'
import { CreateMarkTeacherDto } from './dto/create-mark-teacher.dto'
import { CreateMark } from './dto/create-mark.dto'
import { PersonType } from './mark.enum'
import { IMark, ITimeResponse } from './mark.interface'
import {
  Marks,
  MarksDetail,
  MarksDetailType,
  MarksDocument,
  PointList,
} from './mark.schema'

@Injectable()
export class MarkService {
  constructor(
    @Inject('RATING_CLIENT')
    private readonly client: ClientProxy,
    @InjectModel(Marks.name) readonly model: Model<MarksDocument>,
    private classService: ClassService,
    private ratingPagesService: RatingPagesService,
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
      const newMarkDetail = {
        studentId: userID,
        totalPoint: 0,
        pointList: dto.pointList,
      }
      await this.compareScore(newMarkDetail)
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
      await this.compareScore(newMarkDetail)
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
    await this.compareScore(newMarkDetail)
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

  async createMarkTeacher(studentId: number, dto: CreateMarkTeacherDto) {
    const data = await this.classService.findClassByStudentId(studentId)
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
            studentId: studentId,
            totalPoint: 0,
            pointList: dto.pointList,
          },
        ],
      }
      const newMarkDetail = {
        studentId: studentId,
        totalPoint: 0,
        pointList: dto.pointList,
      }
      await this.compareScore(newMarkDetail)
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
      await this.compareScore(newMarkDetail)
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
    await this.compareScore(newMarkDetail)
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

  async createMarkMonitor(studentId: number, dto: CreateMarkMonitorDto) {
    const data = await this.classService.findClassByStudentId(studentId)
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
            studentId: studentId,
            totalPoint: 0,
            pointList: dto.pointList,
          },
        ],
      }
      const newMarkDetail = {
        studentId: studentId,
        totalPoint: 0,
        pointList: dto.pointList,
      }
      await this.compareScore(newMarkDetail)
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
      await this.compareScore(newMarkDetail)
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
    await this.compareScore(newMarkDetail)
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

  async getScore(userId: number, studentId: number, type: PersonType) {
    let classId = 0
    if (type === PersonType.Student) {
      classId = await (
        await this.classService.findClassByStudentId(userId)
      ).classId
    } else {
      classId = await (
        await this.classService.findClassByStudentId(studentId)
      ).classId
    }
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
      throw new BadRequestException(
        'Currently no rating-pages assigned with this classId.Please create new!',
      )
    }
    return findClassMark
  }

  public async calculationScore(id: number, type: PersonType) {
    const dataClass = await this.classService.findClassByStudentId(id)
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const data = await this.ratingPagesService.getRatingPagesWithSemesterInfo(
      res.semester,
      res.startYear,
      res.endYear,
    )
    const findClassMark = await this.model.findOne({
      $and: [
        { classId: dataClass.classId },
        { startYear: res.startYear },
        { endYear: res.endYear },
        { semester: res.semester },
      ],
    })
    if (!findClassMark) {
      return 0
    }
    if (findClassMark.markDetail.find((x) => x.studentId === id)) {
      const currentMark = findClassMark.markDetail.find(
        (x) => x.studentId === id,
      )
      let totalScore = 0
      await Promise.all(
        currentMark.pointList.map(async (point) => {
          const ratingPages = data.type.find((ratingPage) => {
            return ratingPage.idType === point.idType
          })
          await Promise.all(
            point.subType.map(async (subPoint) => {
              const subRatingPages = ratingPages.subType.find(
                (subRatingPage) => {
                  return subRatingPage.idSubType === subPoint.idSubType
                },
              )
              await Promise.all(
                subPoint.subTypeScore.map(async (subTypePoint) => {
                  const subTypeRatingPages = subRatingPages.subTypeScore.find(
                    (subTypeRatingPage) => {
                      return (
                        subTypeRatingPage.idSubTypeScore ===
                        subTypePoint.idSubTypeScore
                      )
                    },
                  )
                  if (type === PersonType.Student) {
                    totalScore += subTypePoint.studentScore
                  }
                  if (type === PersonType.Monitor) {
                    totalScore += subTypePoint.monitorScore
                  }
                  if (type === PersonType.Teacher) {
                    totalScore += subTypePoint.teacherScore
                  }
                }),
              )
            }),
          )
        }),
      )
      return totalScore
    }
    return 0
  }

  private async compareScore(dto: MarksDetail) {
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const data = await this.ratingPagesService.getRatingPagesWithSemesterInfo(
      res.semester,
      res.startYear,
      res.endYear,
    )
    await Promise.all(
      dto.pointList.map(async (point) => {
        const ratingPages = data.type.find((ratingPage) => {
          return ratingPage.idType === point.idType
        })
        await Promise.all(
          point.subType.map(async (subPoint) => {
            const subRatingPages = ratingPages.subType.find((subRatingPage) => {
              return subRatingPage.idSubType === subPoint.idSubType
            })

            await Promise.all(
              subPoint.subTypeScore.map(async (subTypePoint) => {
                const subTypeRatingPages = subRatingPages.subTypeScore.find(
                  (subTypeRatingPage) => {
                    return (
                      subTypeRatingPage.idSubTypeScore ===
                      subTypePoint.idSubTypeScore
                    )
                  },
                )
                if (subTypePoint.monitorScore) {
                  if (
                    this.compareSubScore(
                      subTypePoint.monitorScore,
                      subTypeRatingPages.score,
                    ) === false
                  ) {
                    throw new BadRequestException(
                      'Your mark score must be lower than rating score',
                    )
                  }
                }
                if (subTypePoint.teacherScore) {
                  if (
                    this.compareSubScore(
                      subTypePoint.teacherScore,
                      subTypeRatingPages.score,
                    ) === false
                  ) {
                    throw new BadRequestException(
                      'Your mark score must be lower than rating score',
                    )
                  }
                }
                if (subTypePoint.studentScore) {
                  if (
                    this.compareSubScore(
                      subTypePoint.studentScore,
                      subTypeRatingPages.score,
                    ) === false
                  ) {
                    throw new BadRequestException(
                      'Your mark score must be lower than rating score',
                    )
                  }
                }
              }),
            )
          }),
        )
      }),
    )
  }

  compareSubScore(markScore: number, ratingScore: number) {
    if (markScore > ratingScore) {
      return false
    }
    return true
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
