import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsEnum, IsNumber } from 'src/decorators/validators'
import { PersonType } from '../mark.enum'

export class GetScoreMarkDto {
  @IsEnum({ notEmpty: true, entity: PersonType })
  @ApiProperty({
    type: 'enum',
    enum: PersonType,
    default: PersonType.Student,
  })
  type: PersonType

  @IsOptional()
  @IsNumber({ notEmpty: true, positive: true })
  @ApiProperty({
    type: Number,
    description: 'Student Id',
    example: '1',
  })
  studentId: number
}
