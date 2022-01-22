import { BaseSchema } from '../../decorators'
import { BaseMongo } from '../../common/dto'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { Document, SchemaTypes } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { AutoMap } from '@automapper/classes'
import { IsNumber, IsArray } from '../../decorators/validators'

export type ClassDocument = Class & Document

export class Students {
  @ApiProperty({ example: 1 })
  @IsNumber({ negative: false, notEmpty: true, min: 1, max: 3 })
  semester: number

  @ApiProperty({ example: 1 })
  @IsNumber({ negative: false, notEmpty: true })
  startYear: number

  @ApiProperty({ example: 1 })
  @IsNumber({ negative: false, notEmpty: true })
  endYear: number

  @ApiProperty({ example: [1, 2] })
  @IsArray({ notEmpty: true, nestedType: Number })
  studentsIds: [number]

  @ApiProperty({ example: 60000002 })
  @IsNumber({ negative: false })
  headMasterId: number

  @ApiProperty({ example: 675105036 })
  @IsNumber({ negative: false })
  monitorId: number
}

@BaseSchema()
export class Class extends BaseMongo {
  @Prop({ required: true, unique: true })
  @AutoMap()
  classId: number

  @Prop({ required: true })
  @AutoMap()
  courseId: number

  @Prop({ type: SchemaTypes.Mixed })
  @AutoMap()
  students: Students[]
}
export const ClassSchema = SchemaFactory.createForClass(Class)

ClassSchema.plugin(mongooseLeanVirtuals)
