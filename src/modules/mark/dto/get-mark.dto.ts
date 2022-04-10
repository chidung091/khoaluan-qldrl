import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsNumber } from 'src/decorators/validators'

export class GetMarkDto {
  @IsOptional()
  @IsNumber({ notEmpty: true, positive: true })
  @ApiProperty({
    type: Number,
    description: 'Class Id',
    example: '1',
  })
  classId: number

  @IsOptional()
  @IsNumber({ notEmpty: true, positive: true })
  @ApiProperty({
    type: Number,
    description: 'Student Id',
    example: '1',
  })
  studentId: number
}
