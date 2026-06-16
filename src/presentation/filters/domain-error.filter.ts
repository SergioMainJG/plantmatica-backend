import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";
import { FastifyReply } from "fastify";

@Catch(TypeNotSatisfiedError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: TypeNotSatisfiedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<FastifyReply>();

    resp.status(400).send(
      {
        statusCode: 400,
        error: 'Bad Request',
        message: exception.message,
      }
    )
  }
}