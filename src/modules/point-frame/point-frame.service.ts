import { Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PaginationQueryDto } from 'src/common/dto'
import { IDataWithPagination } from 'src/common/interfaces'
import { CreatePointFrameDto } from './dto/create-point-frame.dto'
import { PointFrameResponse } from './dto/point-frame.response.dto'
import { PointFrame, PointFrameDocument } from './point-frame.schema'

@Injectable()
export class PointFrameService {
  constructor(
    @InjectModel(PointFrame.name) readonly model: Model<PointFrameDocument>,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  async createNewPointFrame(dto: CreatePointFrameDto) {
    try {
      const ratingPagesCreate = (
        await this.model.create({
          ...dto,
        })
      ).toObject()

      return this.mapper.map(ratingPagesCreate, PointFrameResponse, PointFrame)
    } catch (error) {
      throw error
    }
  }

  async getAllRatingPages(
    reqQuery: PaginationQueryDto,
  ): Promise<IDataWithPagination<PointFrameResponse>> {
    const { page, perPage } = reqQuery

    const [data, total] = await Promise.all([
      this.model
        .find()
        .sort({ _id: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean({ virtuals: true }),
      this.model.count(),
    ])

    return {
      data: this.mapper.mapArray(data, PointFrameResponse, PointFrame),
      total,
      page,
      perPage,
      totalPage: Math.ceil(total / perPage),
    }
  }

  async getRatingPagesById(id: string) {
    const data = await this.model.findOne({ id })
    if (!data) {
      throw new NotFoundException('RATING_PAGES_NOT_FOUND')
    }
    return this.mapper.map(data.toObject(), PointFrameResponse, PointFrame)
  }

  async updateRatingPages(id: string, dto: CreatePointFrameDto) {
    const rc = await this.model.findOne({
      _id: id,
    })

    if (!rc) {
      throw new NotFoundException('RATE_CARD_NOT_FOUND')
    }

    const updateStatus = (
      await this.model.findByIdAndUpdate(id, dto, { new: true })
    ).toObject()
    return this.mapper.map(updateStatus, PointFrameResponse, PointFrame)
  }

  async deleteRatingPages(id: string) {
    const rc = await this.model.findOne({
      _id: id,
    })

    if (!rc) {
      throw new NotFoundException('RATING_PAGES_NOT_FOUND')
    }

    const updateStatus = (await this.model.findByIdAndDelete(id)).toObject()
    return this.mapper.map(updateStatus, PointFrameResponse, PointFrame)
  }
}
