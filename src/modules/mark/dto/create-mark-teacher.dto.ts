import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsArray, IsNumber } from '../../../decorators/validators'
import { Score } from '../mark.schema'

export class UpdateScoreTeacherDto extends OmitType(Score, [
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
export class PointListTeacherDto {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubType: number

  @ApiPropertyOptional({
    type: [UpdateScoreTeacherDto],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: UpdateScoreTeacherDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: UpdateScoreTeacherDto) => o.idSubTypeScore],
    minSize: 1,
  })
  subTypeScore: UpdateScoreTeacherDto[]
}

export class CreateMarkTeacherDto {
  @ApiPropertyOptional({
    type: [PointListTeacherDto],
    description: 'PointList',
  })
  @IsArray({
    nestedType: PointListTeacherDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointListTeacherDto) => o.idSubType],
    minSize: 1,
  })
  pointList: PointListTeacherDto[]
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
