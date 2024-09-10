import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
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
  const isDev = process.env.NODE_ENV !== 'production'

  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: isDev ? true : false,
  });

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

  // swagger
  if (process.env.NODE_ENV !== 'production') {
    const configDoc = new DocumentBuilder()
      .setTitle("Stay API")
      .setDescription("Swagger documentation for Stay Api")
      .setVersion("1.0.0")
      .build();
    const docs = SwaggerModule.createDocument(app, configDoc)
    SwaggerModule.setup("/", app, docs);
  }


  const port = isDev ? 3000 : process.env.PORT ?? 3000;
  console.info(`###################################################################################`);
  console.info(`########################## Server running at ${port} #############################`);
  console.info(`########################## NODE ENV : ${process.env.NODE_ENV} #############################`);
  console.info(`###################################################################################`);
  await app.listen(port);
}

bootstrap();
