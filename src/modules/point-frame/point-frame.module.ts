import { Module } from '@nestjs/common'
import { PointFrameService } from './point-frame.service'
import { PointFrameController } from './point-frame.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { PointFrame, PointFrameSchema } from './point-frame.schema'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE_AUTH_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PointFrame.name, schema: PointFrameSchema },
    ]),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE_AUTH_SERVICE,
          port: 4002,
        },
      },
    ]),
  ],
  providers: [PointFrameService],
  controllers: [PointFrameController],
})
export class PointFrameModule {}
