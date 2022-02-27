import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { mapFrom, Mapper } from '@automapper/core'
import { Injectable } from '@nestjs/common'
import { RatingPages } from './rating-pages.schema'
import { RatingPagesResponse } from './dto/rating-pages.response.dto'

@Injectable()
export class RatingPagesMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(RatingPages, RatingPagesResponse).forMember(
        (d) => d.type,
        mapFrom((s) => s.type),
      )
    }
  }
}
