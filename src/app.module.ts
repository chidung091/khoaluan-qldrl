import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from './modules/shared/shared.module'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { DATABASE_URI } from './config/secrets'

@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    MongooseModule.forRoot(DATABASE_URI),
    SharedModule,
  ],
})
export class AppModule {}
