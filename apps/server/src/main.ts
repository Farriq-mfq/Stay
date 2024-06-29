import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
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
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()))

  app.enableCors({
    // origin: ['http://localhost:5173'],
    // origin: ['*'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  const isDev = process.env.NODE_ENV !== 'production'
  const port = isDev ? 3000 : process.env.PORT ?? 3000;
  console.info(`###################################################################################`);
  console.info(`########################## Server running at ${port} #############################`);
  console.info(`########################## NODE ENV : ${process.env.NODE_ENV} #############################`);
  console.info(`###################################################################################`);
  await app.listen(port);
}

bootstrap();
