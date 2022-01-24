import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from '../../../decorators/validators'

export class FindHeadMasterStudentListDto {
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

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classId: number
}
