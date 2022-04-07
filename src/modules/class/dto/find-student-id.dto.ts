import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from '../../../decorators/validators'

export class FindStudentListByStudentID {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  studentId: number

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
