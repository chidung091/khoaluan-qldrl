import { Module } from '@nestjs/common'
import { ClassService } from './class.service'
import { ClassController } from './class.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Class, ClassSchema } from './class.schema'
import { ClassMapper } from './class.mapper'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  providers: [ClassService, ClassMapper],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
