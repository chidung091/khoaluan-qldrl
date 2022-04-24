import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsArray, IsNumber } from 'src/decorators/validators'
import { PointFrameList } from '../point-frame.schema'

export class CreatePointFrameDto {
  @IsArray({ nestedType: PointFrameList, nestedValidate: true })
  @ApiPropertyOptional({
    type: [PointFrameList],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: PointFrameList,
    nestedValidate: true,
    notEmpty: true,
    minSize: 1,
  })
  list: PointFrameList[]
}
