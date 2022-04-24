import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { mapFrom, Mapper } from '@automapper/core'
import { Injectable } from '@nestjs/common'
import { PointFrame } from './point-frame.schema'
import { PointFrameResponse } from './dto/point-frame.response.dto'

@Injectable()
export class PointFrameMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(PointFrame, PointFrameResponse).forMember(
        (d) => d.list,
        mapFrom((s) => s.list),
      )
    }
  }
}
