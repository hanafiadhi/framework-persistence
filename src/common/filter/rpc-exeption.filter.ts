import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const status =
      exception.getError()['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.getError()['message'] || 'Internal server error';

    return throwError(
      () =>
        new RpcException({
          statusCode: status,
          message: message,
        }),
    );
  }
}
