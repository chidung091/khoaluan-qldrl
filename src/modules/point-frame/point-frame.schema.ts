import { BaseSchema } from '../../decorators'
import { BaseMongo } from '../../common/dto'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { Document } from 'mongoose'
import { AutoMap } from '@automapper/classes'

export type PointFrameDocument = PointFrame & Document
@BaseSchema()
export class PointFrame extends BaseMongo {
  @Prop({ required: true })
  @AutoMap()
  stringPoint: string

  @Prop({ required: true })
  @AutoMap()
  minPoint: number

  @Prop({ required: true })
  @AutoMap()
  maxPoint: number
}
export const PointFrameSchema = SchemaFactory.createForClass(PointFrame)

PointFrameSchema.plugin(mongooseLeanVirtuals)
