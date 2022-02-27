import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from './modules/shared/shared.module'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { MONGO_URI } from './config/secrets'
import { ApikeyMiddleware } from './middlewares/apikey.middleware'
import { WebhookModule } from './modules/webhook/webhook.module'
import { ClassModule } from './modules/class/class.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RatingPagesModule } from './modules/rating-pages/rating-pages.module'

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    SharedModule,
    WebhookModule,
    ClassModule,
    RatingPagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApikeyMiddleware).forRoutes('/webhook/')
  }
}
