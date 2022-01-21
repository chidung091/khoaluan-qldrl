import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Students } from '../class.schema'

export class CreateClass {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classId: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  courseId: number

  @ApiPropertyOptional({
    type: [Students],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: Students,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: Students) => o.semester],
    minSize: 1,
  })
  students: Students[]
}
