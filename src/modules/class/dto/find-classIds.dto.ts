import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from '../../../decorators/validators'

export class FindClassIdsDto {
  @ApiProperty()
  @IsArray({ notEmpty: true, nestedType: Number })
  classIds: [number]
}
