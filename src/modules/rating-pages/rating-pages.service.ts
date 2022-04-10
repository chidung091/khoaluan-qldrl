import { Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PaginationQueryDto } from 'src/common/dto'
import { IDataWithPagination } from 'src/common/interfaces'
import { CreateRatingPagesDto } from './dto/create-rating-pages.dto'
import { RatingPagesResponse } from './dto/rating-pages.response.dto'
import { RatingPages, RatingPagesDocument } from './rating-pages.schema'

@Injectable()
export class RatingPagesService {
  constructor(
    @InjectModel(RatingPages.name) readonly model: Model<RatingPagesDocument>,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  async createNewRatingPages(dto: CreateRatingPagesDto) {
    try {
      const ratingPagesCreate = (
        await this.model.create({
          ...dto,
        })
      ).toObject()

      return this.mapper.map(
        ratingPagesCreate,
        RatingPagesResponse,
        RatingPages,
      )
    } catch (error) {
      throw error
    }
  }

  async getAllRatingPages(
    reqQuery: PaginationQueryDto,
  ): Promise<IDataWithPagination<RatingPagesResponse>> {
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
      data: this.mapper.mapArray(data, RatingPagesResponse, RatingPages),
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
    return this.mapper.map(data.toObject(), RatingPagesResponse, RatingPages)
  }

  async getRatingPagesWithSemesterInfo(
    semester: number,
    startYear: number,
    endYear: number,
  ) {
    const findClassMark = await this.model.findOne({
      $and: [
        { startYear: startYear },
        { endYear: endYear },
        { semester: semester },
      ],
    })
    if (!findClassMark) {
      throw new BadRequestException(
        'Currently no rating-pages assigned with this classId.Please create new!',
      )
    }
    return findClassMark
  }

  async updateRatingPages(id: string, dto: CreateRatingPagesDto) {
    const rc = await this.model.findOne({
      _id: id,
    })

    if (!rc) {
      throw new NotFoundException('RATE_CARD_NOT_FOUND')
    }

    const updateStatus = (
      await this.model.findByIdAndUpdate(id, dto, { new: true })
    ).toObject()
    return this.mapper.map(updateStatus, RatingPagesResponse, RatingPages)
  }

  async deleteRatingPages(id: string) {
    const rc = await this.model.findOne({
      _id: id,
    })

    if (!rc) {
      throw new NotFoundException('RATING_PAGES_NOT_FOUND')
    }

    const updateStatus = (await this.model.findByIdAndDelete(id)).toObject()
    return this.mapper.map(updateStatus, RatingPagesResponse, RatingPages)
  }
}
