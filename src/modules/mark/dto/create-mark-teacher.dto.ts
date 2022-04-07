import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Score } from '../mark.schema'

export class UpdateScoreDto extends OmitType(Score, [
  'monitorScore',
  'studentScore',
]) {
  @Exclude()
  @ApiHideProperty()
  monitorScore: number

  @Exclude()
  @ApiHideProperty()
  studentScore: number
}
export class PointListDto {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubType: number

  @ApiPropertyOptional({
    type: [UpdateScoreDto],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: UpdateScoreDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: UpdateScoreDto) => o.idSubTypeScore],
    minSize: 1,
  })
  subTypeScore: UpdateScoreDto[]
}

export class CreateMarkTeacherDto {
  @ApiPropertyOptional({
    type: [PointListDto],
    description: 'PointList',
  })
  @IsArray({
    nestedType: PointListDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointListDto) => o.idSubType],
    minSize: 1,
  })
  pointList: PointListDto[]
}

export class CreateMarkTeacherParamDto {
  @IsNumber({ notEmpty: true, positive: true })
  @ApiProperty({
    type: Number,
    description: 'Class Id',
    example: '1',
  })
  classId: number

  @IsNumber({ notEmpty: true, positive: true })
  @ApiProperty({
    type: Number,
    description: 'Student Id',
    example: '1',
  })
  studentId: number
}
