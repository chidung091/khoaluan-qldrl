import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsNumber } from '../../../decorators/validators'

export class FindHeadMasterStudentListIdDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber({ notEmpty: false })
  studentId: number

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
