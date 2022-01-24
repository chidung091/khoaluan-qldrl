import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from '../../../decorators/validators'

export class FindClassIdDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classId: number
}
