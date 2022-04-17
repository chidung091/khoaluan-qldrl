import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import moment from 'moment'
import { Model } from 'mongoose'
import { firstValueFrom } from 'rxjs'
import { ClassService } from '../class/class.service'
import { RatingPagesService } from '../rating-pages/rating-pages.service'
import { CreateMarkMonitorDto } from './dto/create-mark-monitor.dto'
import { CreateMarkTeacherDto } from './dto/create-mark-teacher.dto'
import { CreateMark } from './dto/create-mark.dto'
import { ApproveStatus, MarkStatus, PersonType } from './mark.enum'
import { IDetailUserResponse, IMark, ITimeResponse } from './mark.interface'
import { Marks, MarksDetail, MarksDocument } from './mark.schema'

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
    const dateNow = new Date(moment().toDate())
    const dateEnd = new Date(res.endTimeStudent)
    const dateStart = new Date(res.startTimeStudent)
    if (dateNow > dateEnd || dateNow < dateStart) {
      throw new BadRequestException('Right now not time to mark the point')
    }
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
        approvedStatus: ApproveStatus.Pending,
      }
      const newMarkDetail = {
        studentId: userID,
        totalPoint: 0,
        pointList: dto.pointList,
        studentStatus: dto.studentStatus,
        monitorStatus: MarkStatus.Drafted,
        teacherStatus: MarkStatus.Drafted,
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
      if (currentMark.studentStatus === MarkStatus.Saved) {
        throw new BadRequestException(
          'This person mark point is saved and cant change',
        )
      }
      const newMarkDetail = {
        studentId: currentMark.studentId,
        totalPoint: 0,
        pointList: dto.pointList,
        studentStatus: dto.studentStatus,
        monitorStatus: currentMark.monitorStatus,
        teacherStatus: currentMark.teacherStatus,
      }
      await this.compareScore(newMarkDetail)
      newArray.push(newMarkDetail)
      const newData = {
        classId: findClassMark.classId,
        semester: findClassMark.semester,
        startYear: findClassMark.startYear,
        endYear: findClassMark.endYear,
        markDetail: newArray,
        approvedStatus: findClassMark.approvedStatus,
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
      studentStatus: dto.studentStatus,
      monitorStatus: MarkStatus.Drafted,
      teacherStatus: MarkStatus.Drafted,
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
      approvedStatus: findClassMark.approvedStatus,
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
    const dateNow = new Date(moment().toDate())
    const dateEnd = new Date(res.endTimeHeadMaster)
    const dateStart = new Date(res.startTimeHeadMaster)
    if (dateNow > dateEnd || dateNow < dateStart) {
      throw new BadRequestException('Right now not time to mark the point')
    }
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
            studentStatus: MarkStatus.Drafted,
            monitorStatus: MarkStatus.Drafted,
            teacherStatus: dto.teacherStatus,
          },
        ],
        approvedStatus: ApproveStatus.Pending,
      }
      const newMarkDetail = {
        studentId: studentId,
        totalPoint: 0,
        pointList: dto.pointList,
        studentStatus: MarkStatus.Drafted,
        monitorStatus: MarkStatus.Drafted,
        teacherStatus: dto.teacherStatus,
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
      if (currentMark.teacherStatus === MarkStatus.Saved) {
        throw new BadRequestException(
          'This person mark point is saved and cant change',
        )
      }
      const newMarkDetail = {
        studentId: currentMark.studentId,
        totalPoint: 0,
        pointList: dto.pointList,
        studentStatus: currentMark.studentStatus,
        monitorStatus: currentMark.monitorStatus,
        teacherStatus: dto.teacherStatus,
      }
      await this.compareScore(newMarkDetail)
      newArray.push(newMarkDetail)
      const newData = {
        classId: findClassMark.classId,
        semester: findClassMark.semester,
        startYear: findClassMark.startYear,
        endYear: findClassMark.endYear,
        markDetail: newArray,
        approvedStatus: findClassMark.approvedStatus,
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
      studentStatus: MarkStatus.Drafted,
      monitorStatus: MarkStatus.Drafted,
      teacherStatus: dto.teacherStatus,
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
      approvedStatus: findClassMark.approvedStatus,
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
    const dateNow = new Date(moment().toDate())
    const dateEnd = new Date(res.endTimeMonitor)
    const dateStart = new Date(res.startTimeMonitor)
    if (dateNow > dateEnd || dateNow < dateStart) {
      throw new BadRequestException('Right now not time to mark the point')
    }
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
            studentStatus: MarkStatus.Drafted,
            teacherStatus: MarkStatus.Drafted,
            monitorStatus: dto.monitorStatus,
          },
        ],
        approvedStatus: ApproveStatus.Pending,
      }
      const newMarkDetail = {
        studentId: studentId,
        totalPoint: 0,
        pointList: dto.pointList,
        studentStatus: MarkStatus.Drafted,
        teacherStatus: MarkStatus.Drafted,
        monitorStatus: dto.monitorStatus,
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
        studentStatus: currentMark.studentStatus,
        teacherStatus: currentMark.teacherStatus,
        monitorStatus: dto.monitorStatus,
      }
      await this.compareScore(newMarkDetail)
      newArray.push(newMarkDetail)
      const newData = {
        classId: findClassMark.classId,
        semester: findClassMark.semester,
        startYear: findClassMark.startYear,
        endYear: findClassMark.endYear,
        markDetail: newArray,
        approvedStatus: findClassMark.approvedStatus,
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
      studentStatus: MarkStatus.Drafted,
      teacherStatus: MarkStatus.Drafted,
      monitorStatus: dto.monitorStatus,
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
      approvedStatus: findClassMark.approvedStatus,
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
    let finalStudentId = 0
    if (type === PersonType.Student) {
      classId = await (
        await this.classService.findClassByStudentId(userId)
      ).classId
      finalStudentId = userId
    } else {
      classId = await (
        await this.classService.findClassByStudentId(studentId)
      ).classId
      finalStudentId = studentId
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
    const currentMark = findClassMark.markDetail.find(
      (x) => x.studentId === finalStudentId,
    )
    const resDetailUser = await firstValueFrom<IDetailUserResponse>(
      this.client.send(
        { role: 'detail-user', cmd: 'get-by-id' },
        finalStudentId,
      ),
    )
    const resClassName = await firstValueFrom<string>(
      this.client.send({ role: 'class', cmd: 'get-class-name' }, classId),
    )
    const year = res.startYear + '-' + res.endYear
    if (!findClassMark.markDetail.find((x) => x.studentId === finalStudentId)) {
      const dataResponse = {
        studentId: finalStudentId,
        year: year,
        semester: res.semester,
        name: resDetailUser.name,
        birthDate: resDetailUser.birthDate,
        className: resClassName,
      }
      return dataResponse
    }
    const dataResponse = {
      pointList: currentMark.pointList,
      studentId: finalStudentId,
      year: year,
      semester: res.semester,
      name: resDetailUser.name,
      birthDate: resDetailUser.birthDate,
      className: resClassName,
    }
    return dataResponse
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

  public async calculationScoreWithoutCurrentSemesterInfo(
    id: number,
    startYear: number,
    endYear: number,
    semester: number,
    type: PersonType,
  ) {
    const dataClass = await this.classService.findClassByStudentId(id)
    const res = await firstValueFrom<ITimeResponse>(
      this.client.send({ role: 'time', cmd: 'get-active' }, {}),
    )
    const data = await this.ratingPagesService.getRatingPagesWithSemesterInfo(
      semester,
      startYear,
      endYear,
    )
    const findClassMark = await this.model.findOne({
      $and: [
        { classId: dataClass.classId },
        { startYear: startYear },
        { endYear: endYear },
        { semester: semester },
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
          await Promise.all(
            point.subType.map(async (subPoint) => {
              await Promise.all(
                subPoint.subTypeScore.map(async (subTypePoint) => {
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

  async getHistoryMark(userId: number) {
    const data = await this.classService.findClassByStudentId(userId)
    const findClassMark = await this.model.find({
      classId: data.classId,
    })
    const dataResponse = []
    if (!findClassMark) {
      throw new BadRequestException(`Can't findClassMark`)
    }
    await Promise.all(
      findClassMark.map(async (singleClass) => {
        const startYear = singleClass.startYear
        const endYear = singleClass.endYear
        const semester = singleClass.semester
        await Promise.all(
          singleClass.markDetail.map(async (singleMarkDetail) => {
            if (singleMarkDetail.studentId) {
              const totalStudentPoint =
                await this.calculationScoreWithoutCurrentSemesterInfo(
                  userId,
                  startYear,
                  endYear,
                  semester,
                  PersonType.Student,
                )
              const totalTeacherPoint =
                await this.calculationScoreWithoutCurrentSemesterInfo(
                  userId,
                  startYear,
                  endYear,
                  semester,
                  PersonType.Teacher,
                )
              const totalMonitorPoint =
                await this.calculationScoreWithoutCurrentSemesterInfo(
                  userId,
                  startYear,
                  endYear,
                  semester,
                  PersonType.Monitor,
                )
              const dataRes = {
                startYear: startYear,
                endYear: endYear,
                semester: semester,
                totalStudentPoint: totalStudentPoint,
                totalMonitorPoint: totalMonitorPoint,
                totalTeacherPoint: totalTeacherPoint,
              }
              dataResponse.push(dataRes)
            }
          }),
        )
      }),
    )
    return dataResponse
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
