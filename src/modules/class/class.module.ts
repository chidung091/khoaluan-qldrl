import { Module } from '@nestjs/common'
import { ClassService } from './class.service'
import { ClassController } from './class.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Class, ClassSchema } from './class.schema'
import { ClassMapper } from './class.mapper'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE1_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BE_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE1_SERVICE,
          port: 4003,
        },
      },
    ]),
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  providers: [ClassService, ClassMapper],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
