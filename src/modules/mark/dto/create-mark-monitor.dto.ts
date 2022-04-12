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

export class UpdateScoreMonitorDto extends OmitType(Score, [
  'teacherScore',
  'studentScore',
]) {
  @Exclude()
  @ApiHideProperty()
  teacherScore: number

  @Exclude()
  @ApiHideProperty()
  studentScore: number
}
export class PointListMonitorDto {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idSubType: number

  @ApiPropertyOptional({
    type: [UpdateScoreMonitorDto],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: UpdateScoreMonitorDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: UpdateScoreMonitorDto) => o.idSubTypeScore],
    minSize: 1,
  })
  subTypeScore: UpdateScoreMonitorDto[]
}
export class PointTypeMonitor {
  @ApiProperty({ example: 1 })
  @IsNumber({ notEmpty: true })
  idType: number

  @ApiPropertyOptional({
    type: [PointListMonitorDto],
    description: 'Required information for Students',
  })
  @IsArray({
    nestedType: PointListMonitorDto,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointListMonitorDto) => o.idSubType],
    minSize: 1,
  })
  subType: PointListMonitorDto[]
}
export class CreateMarkMonitorDto {
  @ApiPropertyOptional({
    type: [PointTypeMonitor],
    description: 'PointList',
  })
  @IsArray({
    nestedType: PointTypeMonitor,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: PointTypeMonitor) => o.idType],
    minSize: 1,
  })
  pointList: PointTypeMonitor[]

  @ApiProperty({
    enum: MarkStatus,
    default: MarkStatus.Drafted,
  })
  @IsEnum({ entity: MarkStatus, notEmpty: true })
  monitorStatus: MarkStatus
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
