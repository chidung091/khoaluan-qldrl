import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './modules/shared/services';
import { SharedModule } from './modules/shared/shared.module';
import { UserMiddleware } from './middleware';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    MongooseModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return configService.mongoConfig;
      },
      inject: [ConfigService],
    }),
    SharedModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
