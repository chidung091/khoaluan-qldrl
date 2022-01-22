import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Students } from '../class.schema'

export class FindClassIdsDto {
  @ApiProperty()
  @IsArray({ notEmpty: true, nestedType: Number })
  classIds: [number]
}
