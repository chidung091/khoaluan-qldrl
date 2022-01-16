import { Injectable } from '@nestjs/common'
import config from 'config'

@Injectable()
export class ConfigService {
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development'
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production'
  }

  private getNumber(key: string, defaultValue?: number): number {
    const value = config.get(key) || defaultValue

    if (value === undefined) {
      throw new Error(key + ' env var not set') // probably we should call process.exit() too to avoid locking the service
    }

    try {
      return Number(value)
    } catch {
      throw new Error(key + ' env var is not a number')
    }
  }

  private getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = (config.get(key) as string) || defaultValue?.toString()

    if (value === undefined) {
      throw new Error(key + ' env var not set')
    }

    try {
      return Boolean(JSON.parse(value))
    } catch {
      throw new Error(key + ' env var is not a boolean')
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = config.get(key) || defaultValue

    if (!value) {
      console.warn(`"${key}" environment variable is not set`)

      return
    }

    return value.toString().replace(/\\n/g, '\n')
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV', 'development')
  }

  get mongoConfig() {
    const uri = this.getString('mongodb.uri')

    if (uri)
      return {
        uri,
      }

    return {
      uri: `mongodb://${this.getString('mongodb.host')}:${this.getString(
        'mongodb.port',
      )}/`,
      dbName: this.getString('mongodb.database'),
      user: this.getString('mongodb.username'),
      pass: this.getString('mongodb.password'),
    }
  }

  get appConfig() {
    return {
      host: this.getString('server.host'),
      port: this.getString('server.port'),
      hostname: this.getString('server.hostname'),
    }
  }

  get redisConfig() {
    return {
      host: this.getString('redis.host'),
      port: this.getNumber('redis.port'),
      database: this.getNumber('redis.db'),
    }
  }

  get serviceConfig() {
    return {
      apiVersion: this.getString('service.apiVersion'),
      name: this.getString('service.name'),
      docBaseUrl: this.getString('service.docsBaseUrl'),
    }
  }

  get serviceBaseUrl() {
    return this.getString('service.baseUrl')
  }

  get svcEndpoint() {
    return {
      auth: this.getString('externalServices.auth'),
      payment: this.getString('externalServices.payment'),
    }
  }
}

export const configService = new ConfigService()
