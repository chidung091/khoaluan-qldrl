import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AutoMap } from '@automapper/classes'
import { BaseDto } from '../../../common/dto'
import { Type } from '../rating-pages.schema'

export class RatingPagesResponse extends BaseDto {
  @ApiProperty()
  @AutoMap()
  semeister: number

  @ApiProperty()
  @AutoMap()
  startYear: number

  @ApiProperty()
  @AutoMap()
  endYear: number

  @ApiPropertyOptional({
    type: [Type],
    description: 'Required information for Students',
  })
  type: Type[]
}
