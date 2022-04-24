import { AutoMap } from '@automapper/classes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsString } from 'src/decorators/validators'
import { BaseDto } from '../../../common/dto'

export class PointFrameResponse extends BaseDto {
  @ApiProperty({ example: 1 })
  @IsString({ notEmpty: false })
  @AutoMap()
  stringPoint: string

  @ApiProperty({ example: 0 })
  @IsNumber({ negative: false })
  @AutoMap()
  minPoint: number

  @ApiProperty({ example: 30 })
  @IsNumber({ negative: false })
  @AutoMap()
  maxPoint: number
}
