import { BaseSchema } from '../../decorators'
import { BaseMongo } from '../../common/dto'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { Document, SchemaTypes } from 'mongoose'
import { AutoMap } from '@automapper/classes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber } from '../../decorators/validators'
import { ApproveStatus, MarkStatus } from './mark.enum'
import { IsOptional } from 'class-validator'

export type MarksDocument = Marks & Document

export class Score {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubTypeScore: number

  @ApiProperty()
  @IsNumber({ notEmpty: false, defaultValue: 0 })
  studentScore: number

  @ApiProperty()
  @IsNumber({ notEmpty: false, defaultValue: 0 })
  monitorScore: number

  @ApiProperty()
  @IsNumber({ notEmpty: false, defaultValue: 0 })
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
export class MarksDetailType {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idType: number

  @ApiPropertyOptional({
    type: [Score],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: PointList,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointList) => o.idSubType],
    minSize: 1,
  })
  subType: PointList[]
}
export class MarksDetail {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  studentId: number

  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  totalPoint: number

  @ApiProperty({
    enum: MarkStatus,
    default: MarkStatus.Drafted,
  })
  @IsOptional()
  @IsEnum({ entity: MarkStatus })
  studentStatus: MarkStatus

  @ApiProperty({
    enum: MarkStatus,
    default: MarkStatus.Drafted,
  })
  @IsOptional()
  @IsEnum({ entity: MarkStatus })
  monitorStatus: MarkStatus

  @ApiProperty({
    enum: MarkStatus,
    default: MarkStatus.Drafted,
  })
  @IsOptional()
  @IsEnum({ entity: MarkStatus })
  teacherStatus: MarkStatus

  @ApiPropertyOptional({
    type: [MarksDetailType],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: MarksDetailType,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: MarksDetailType) => o.idType],
    minSize: 1,
  })
  pointList: MarksDetailType[]
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

  @Prop({ required: true })
  @AutoMap()
  approvedStatus: ApproveStatus

  @Prop({ type: SchemaTypes.Array })
  @AutoMap()
  markDetail: MarksDetail[]
}
export const MarksSchema = SchemaFactory.createForClass(Marks)

MarksSchema.plugin(mongooseLeanVirtuals)
