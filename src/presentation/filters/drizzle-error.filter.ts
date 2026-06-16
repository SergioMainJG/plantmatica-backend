import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { DrizzleQueryError } from "drizzle-orm";
import { FastifyReply } from "fastify";


@Catch(DrizzleQueryError)
export class DrizzleQueryFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<FastifyReply>();

    if( exception.code === '23505' ){
      resp.status(400).send(
        {
          statusCode: 400,
          error: 'Bad Request',
          message: `The email or name already exists. Try with other email and name`,
        }
      )
    }

    console.error(`Error: ${exception}`);

    resp.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Error en el registro',
    });
  }
} 