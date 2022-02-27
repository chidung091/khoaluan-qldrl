import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Type } from '../rating-pages.schema'

export class CreateRatingPagesDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  semeister: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  startYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  endYear: number

  @ApiPropertyOptional({
    type: [Type],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: Type,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: Type) => o.idType],
    minSize: 1,
  })
  type: Type[]
}
