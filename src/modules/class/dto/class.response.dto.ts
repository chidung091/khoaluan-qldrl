import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AutoMap } from '@automapper/classes'
import { BaseDto } from '../../../common/dto'
import { Students } from '../class.schema'

export class ClassResponse extends BaseDto {
  @ApiProperty()
  @AutoMap()
  classId: number

  @ApiProperty()
  @AutoMap()
  courseId: number

  @ApiPropertyOptional({
    type: [Students],
    description: 'Required information for students',
  })
  students: Students[]
}
