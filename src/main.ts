import dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters'
import { ConfigService } from './modules/shared/services'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app
    .use(helmet())
    .setGlobalPrefix(configService.serviceBaseUrl)
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .useGlobalFilters(new HttpExceptionFilter())
    .enableCors()

  setUpSwagger(app, configService)
  await app.listen(configService.appConfig.port)
}

function setUpSwagger(app: INestApplication, configService: ConfigService) {
  const options = new DocumentBuilder()
    .setTitle('Point Ratings System')
    .setDescription(
      `API specification for Thanh Huyen Point Ratings System.\n
    Terms:\n
    - Internal: only available for other services in Thanh Huyen system.`,
    )
    .setVersion(configService.serviceConfig.apiVersion)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(configService.serviceConfig.docBaseUrl, app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
    customSiteTitle: 'Logistika Pricing API',
  })
}

bootstrap()
