import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsArray, IsNumber } from 'src/decorators/validators'
import { PointFrameList } from '../point-frame.schema'

export class CreatePointFrameDto {
  @IsArray({ nestedType: PointFrameList, nestedValidate: true })
  @ApiProperty({
    type: Number,
    description: 'Class Id',
    example: '1',
  })
  list: PointFrameList[]
}
