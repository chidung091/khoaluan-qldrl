import { Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Class, ClassDocument } from './class.schema'
import { ClassResponse } from './dto/class.response.dto'
import { CreateClass } from './dto/create-class.dto'

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
}
