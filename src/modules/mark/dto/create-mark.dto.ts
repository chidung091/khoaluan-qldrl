import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsArray, IsEnum, IsNumber } from '../../../decorators/validators'
import { MarkStatus } from '../mark.enum'
import { Score } from '../mark.schema'

export class UpdateScoreDto extends OmitType(Score, [
  'monitorScore',
  'teacherScore',
]) {
  @Exclude()
  @ApiHideProperty()
  monitorScore: number

  @Exclude()
  @ApiHideProperty()
  teacherScore: number
}
export class PointListStudentDto {
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

export class PointTypeForStudent {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idType: number

  @ApiPropertyOptional({
    type: [PointListStudentDto],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: PointListStudentDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointListStudentDto) => o.idSubType],
    minSize: 1,
  })
  subType: PointListStudentDto[]
}
export class CreateMark {
  @ApiPropertyOptional({
    type: [PointTypeForStudent],
    description: 'PointList',
  })
  @IsArray({
    nestedType: PointTypeForStudent,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointTypeForStudent) => o.idType],
    minSize: 1,
  })
  pointList: PointTypeForStudent[]

  @ApiProperty({
    enum: MarkStatus,
    default: MarkStatus.Drafted,
  })
  @IsEnum({ entity: MarkStatus, notEmpty: true })
  studentStatus: MarkStatus
}
