import { BaseSchema } from '../../decorators'
import { BaseMongo } from '../../common/dto'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { Document, SchemaTypes } from 'mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AutoMap } from '@automapper/classes'
import {
  IsNumber,
  IsArray,
  IsString,
  IsEnum,
} from '../../decorators/validators'
import { Category } from './rating-pages.enum'

export type RatingPagesDocument = RatingPages & Document

export class SubTypeScore {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubTypeScore: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  name: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  score: number
}
export class SubType {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubType: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  name: string

  @ApiProperty()
  @IsEnum({ notEmpty: true, entity: Category })
  category: Category

  @ApiPropertyOptional({
    type: [SubTypeScore],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: SubTypeScore,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: SubTypeScore) => o.idSubTypeScore],
    minSize: 1,
  })
  subTypeScore: SubTypeScore[]
}
export class Type {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idType: number

  @ApiProperty({ example: 1 })
  @IsString({ notEmpty: true })
  name: string

  @ApiPropertyOptional({
    type: [SubType],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: SubType,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: SubType) => o.idSubType],
    minSize: 1,
  })
  subType: SubType[]
}

@BaseSchema()
export class RatingPages extends BaseMongo {
  @Prop({ required: true })
  @AutoMap()
  semeister: number

  @Prop({ required: true })
  @AutoMap()
  startYear: number

  @Prop({ required: true })
  @AutoMap()
  endYear: number

  @Prop({ type: SchemaTypes.Mixed })
  @AutoMap()
  type: Type[]
}
export const RatingPagesSchema = SchemaFactory.createForClass(RatingPages)

RatingPagesSchema.plugin(mongooseLeanVirtuals)
