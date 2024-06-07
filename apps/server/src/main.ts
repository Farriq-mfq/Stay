import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
// for error : Do not know how to serialize a BigInt prisma issue 
// solution : https://github.com/prisma/studio/issues/614
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation
  app.useGlobalPipes(new ValidationPipe());

  // prisma exception
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // interceptor response
  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(3000);
}
bootstrap();
