import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from './modules/shared/shared.module'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { ENV, MONGO_URI } from './config/secrets'
import { ConfigModule } from '@nestjs/config'
import { ApikeyMiddleware } from './middlewares/apikey.middleware'
import { WebhookModule } from './modules/webhook/webhook.module'
import { ClassModule } from './modules/class/class.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    MongooseModule.forRoot(MONGO_URI),
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    SharedModule,
    WebhookModule,
    ClassModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApikeyMiddleware).forRoutes('/webhook/')
  }
}
