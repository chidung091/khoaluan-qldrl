import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { mapFrom, Mapper } from '@automapper/core'
import { Injectable } from '@nestjs/common'
import { ClassResponse } from './dto/class.response.dto'
import { Class } from './class.schema'

@Injectable()
export class ClassMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(Class, ClassResponse).forMember(
        (d) => d.students,
        mapFrom((s) => s.students),
      )
    }
  }
}
