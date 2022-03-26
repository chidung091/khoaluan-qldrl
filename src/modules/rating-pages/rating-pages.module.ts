import { Module } from '@nestjs/common'
import { RatingPagesService } from './rating-pages.service'
import { RatingPagesController } from './rating-pages.controller'
import { RatingPagesMapper } from './rating-pages.mapper'
import { MongooseModule } from '@nestjs/mongoose'
import { RatingPages, RatingPagesSchema } from './rating-pages.schema'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE_AUTH_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RatingPages.name, schema: RatingPagesSchema },
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
  providers: [RatingPagesService, RatingPagesMapper],
  controllers: [RatingPagesController],
})
export class RatingPagesModule {}
