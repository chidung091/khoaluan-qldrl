import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from './modules/shared/shared.module'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { MONGO_URI } from './config/secrets'
import { ClassModule } from './modules/class/class.module'
import { RatingPagesModule } from './modules/rating-pages/rating-pages.module'
import { UserMiddleware } from './middlewares/user.middleware'
import { MarkModule } from './modules/mark/mark.module'

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, { retryAttempts: 1 }),
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    SharedModule,
    ClassModule,
    RatingPagesModule,
    MarkModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
