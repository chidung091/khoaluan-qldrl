import dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { MICROSERVICE_HOST, PORT } from './config/secrets'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app
    .setGlobalPrefix('/api/')
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .useGlobalFilters(new HttpExceptionFilter())
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: MICROSERVICE_HOST,
      port: 4004,
    },
  })
  setUpSwagger(app)
  app.enableCors()
  await app.startAllMicroservices()
  await app.listen(PORT)
}

function setUpSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Point Ratings System')
    .setDescription(`API specification for Thanh Huyen Point Ratings System.`)
    .setVersion('0.1.2')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
    customSiteTitle: 'Point Ratings System',
  })
}

bootstrap()
