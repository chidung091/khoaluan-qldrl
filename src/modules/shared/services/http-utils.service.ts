import { Injectable } from '@nestjs/common'
import axios from 'axios'
import fetch from 'node-fetch'
import { API_URLS } from 'src/common/constant'
import { ContextProvider } from '../providers'
import { ConfigService } from './config.service'

export enum ApiMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
}

interface ApiParams<P = Record<string, any>> {
  url: string
  data?: P
  method: 'get' | 'post' | 'put'
  headers?: Record<string, any>
}

@Injectable()
export class HttpUtilsService {
  constructor(readonly configService: ConfigService) {}

  call<Payload = any>({ method, url, data, headers }: ApiParams<Payload>) {
    if (method === 'get') {
      return axios.get(url, { headers })
    }

    return axios[method](url, data, { headers })
  }
}
