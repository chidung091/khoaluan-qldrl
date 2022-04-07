import { Module } from '@nestjs/common'
import { MarkService } from './mark.service'
import { MarkController } from './mark.controller'
import { Marks, MarksSchema } from './mark.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE1_SERVICE, BE_AUTH_SERVICE } from 'src/config/secrets'
import { ClassModule } from '../class/class.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Marks.name, schema: MarksSchema }]),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE_AUTH_SERVICE,
          port: 4002,
        },
      },
      {
        name: 'RATING_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE1_SERVICE,
          port: 4003,
        },
      },
    ]),
    ClassModule,
  ],
  providers: [MarkService],
  controllers: [MarkController],
})
export class MarkModule {}
