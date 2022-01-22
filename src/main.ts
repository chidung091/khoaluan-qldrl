import dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { PORT } from './config/secrets'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app
    .use(helmet())
    .setGlobalPrefix('/api')
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .useGlobalFilters(new HttpExceptionFilter())
    .enableCors()

  setUpSwagger(app)
  console.log(PORT)
  await app.listen(PORT)
}

function setUpSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Point Ratings System')
    .setDescription(
      `API specification for Thanh Huyen Point Ratings System.\n
    Terms:\n
    - Internal: only available for other services in Thanh Huyen system.`,
    )
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
