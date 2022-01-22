import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Students } from '../class.schema'

export class FindHeadMasterClassDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  headMasterId: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  startYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  semester: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  endYear: number
}
