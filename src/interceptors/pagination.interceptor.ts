import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { IDataWithPagination } from 'src/common/interfaces'

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: CallHandler<any>,
  ): Observable<any> {
    return call$.handle().pipe(
      map(({ data, page, perPage, total, totalPage }: IDataWithPagination) => {
        const res: Response = context.switchToHttp().getResponse()

        Object.entries({
          'x-page': page,
          'x-total-count': total,
          'x-pages-count': totalPage,
          'x-per-page': perPage,
          'x-next-page': page === totalPage ? page : page + 1,
        }).forEach(([key, value]) => res.setHeader(key, value))

        return data
      }),
    )
  }
}
