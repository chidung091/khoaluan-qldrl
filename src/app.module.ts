import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from './modules/shared/shared.module'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { ENV, MONGO_URI } from './config/secrets'
import { ConfigModule } from '@nestjs/config'

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
  ],
})
export class AppModule {}
