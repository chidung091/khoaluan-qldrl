import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Students } from '../class.schema'

export class FindClassIdDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classId: number
}
