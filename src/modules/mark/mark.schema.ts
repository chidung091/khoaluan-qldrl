import { BaseSchema } from '../../decorators'
import { BaseMongo } from '../../common/dto'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { Document, SchemaTypes } from 'mongoose'
import { AutoMap } from '@automapper/classes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber } from '../../decorators/validators'

export type MarksDocument = Marks & Document

export class Score {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubTypeScore: number

  @ApiProperty()
  @IsNumber({ notEmpty: false })
  studentScore: number

  @ApiProperty()
  @IsNumber({ notEmpty: false })
  monitorScore: number

  @ApiProperty()
  @IsNumber({ notEmpty: false })
  teacherScore: number
}
export class PointList {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubType: number

  @ApiPropertyOptional({
    type: [Score],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: Score,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: Score) => o.idSubTypeScore],
    minSize: 1,
  })
  subTypeScore: Score[]
}

export class MarksDetail {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  studentId: number

  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  totalPoint: number

  @ApiPropertyOptional({
    type: [PointList],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: PointList,
    nestedValidate: true,
    notEmpty: true,
    minSize: 1,
  })
  pointList: PointList[]
}

@BaseSchema()
export class Marks extends BaseMongo {
  @Prop({ required: true })
  @AutoMap()
  classId: number

  @Prop({ required: true })
  @AutoMap()
  semester: number

  @Prop({ required: true })
  @AutoMap()
  startYear: number

  @Prop({ required: true })
  @AutoMap()
  endYear: number

  @Prop({ type: SchemaTypes.Array })
  @AutoMap()
  markDetail: MarksDetail[]
}
export const MarksSchema = SchemaFactory.createForClass(Marks)

MarksSchema.plugin(mongooseLeanVirtuals)
