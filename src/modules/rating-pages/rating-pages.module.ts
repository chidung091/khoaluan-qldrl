import { Module } from '@nestjs/common'
import { RatingPagesService } from './rating-pages.service'
import { RatingPagesController } from './rating-pages.controller'
import { RatingPagesMapper } from './rating-pages.mapper'
import { MongooseModule } from '@nestjs/mongoose'
import { RatingPages, RatingPagesSchema } from './rating-pages.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RatingPages.name, schema: RatingPagesSchema },
    ]),
  ],
  providers: [RatingPagesService, RatingPagesMapper],
  controllers: [RatingPagesController],
})
export class RatingPagesModule {}
