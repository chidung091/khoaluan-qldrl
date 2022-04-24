import { ApiPropertyOptional } from '@nestjs/swagger'
import { AutoMap } from '@automapper/classes'
import { BaseDto } from '../../../common/dto'
import { PointFrameList } from '../point-frame.schema'

export class PointFrameResponse extends BaseDto {
  @ApiPropertyOptional({
    type: [PointFrameList],
    description: 'Required information for Students',
  })
  list: PointFrameList[]
}
