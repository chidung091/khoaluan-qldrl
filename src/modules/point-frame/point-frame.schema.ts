import { BaseSchema } from '../../decorators'
import { BaseMongo } from '../../common/dto'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { Document, SchemaTypes } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { AutoMap } from '@automapper/classes'
import { IsNumber, IsArray } from '../../decorators/validators'

export type PointFrameDocument = PointFrame & Document

export class PointFrameList {
  @ApiProperty({ example: 1 })
  @IsNumber({ negative: false, notEmpty: true })
  stringPoint: string

  @ApiProperty({ example: 60000002 })
  @IsNumber({ negative: false })
  minPoint: number

  @ApiProperty({ example: 675105036 })
  @IsNumber({ negative: false })
  maxPoint: number
}

@BaseSchema()
export class PointFrame extends BaseMongo {
  @Prop({ type: SchemaTypes.Mixed })
  @AutoMap()
  list: PointFrameList[]
}
export const PointFrameSchema = SchemaFactory.createForClass(PointFrame)

PointFrameSchema.plugin(mongooseLeanVirtuals)
