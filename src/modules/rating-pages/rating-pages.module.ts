import { Module } from '@nestjs/common'
import { RatingPagesService } from './rating-pages.service'
import { RatingPagesController } from './rating-pages.controller'

@Module({
  providers: [RatingPagesService],
  controllers: [RatingPagesController],
})
export class RatingPagesModule {}
