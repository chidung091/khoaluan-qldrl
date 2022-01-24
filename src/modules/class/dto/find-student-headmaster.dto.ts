import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from '../../../decorators/validators'

export class FindStudentListByMonitor {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  monitorId: number

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
