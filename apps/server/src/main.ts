import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationError } from 'class-validator';
// for error : Do not know how to serialize a BigInt prisma issue 
// solution : https://github.com/prisma/studio/issues/614
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      const formattedErrors = errors.reduce((acc, err) => {
        const constraints = Object.values(err.constraints);
        acc[err.property] = constraints;
        return acc;
      }, {});
      throw new BadRequestException(formattedErrors);
    },
  }));

  // prisma exception
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // interceptor response
  app.useGlobalInterceptors(new ResponseInterceptor())

  app.enableCors({
    origin: ['http://localhost:5173'],
  })

  await app.listen(3000);
}
bootstrap();
