import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { FastifyReply } from "fastify";


@Catch(Error)
export class DrizzleQueryFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException)
      return resp.status(exception.getStatus()).send(exception.getResponse());

    if (exception.name === 'DrizzleQueryError' || (exception as any).cause?.code) {

      const cause = (exception as any).cause;

      console.log(cause.code);
      if (cause.code === '23505') {
        return resp.status(409).send(
          {
            statusCode: 409,
            error: 'Conflict',
            message: `The email or name already exists. Try with other email and name`,
          }
        )
      }

      if (cause.code === '42P01') {
        return resp.status(500).send(
          {
            statusCode: 500,
            error: 'DB just started',
            message: `Check the backend, the DB has no any schema`,
          }
        )
      }
    }

    console.error('='.repeat(30));
    console.error(`exception: ${exception}`);
    console.error('='.repeat(30));

    return resp.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Error...',
    });
  }
}