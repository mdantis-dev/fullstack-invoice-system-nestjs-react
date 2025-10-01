import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
//   );
//   await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
// }

// import { NestFactory } from '@nestjs/core'
// import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({
    origin: ['http://localhost:5173'], // your Vite dev origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: false, // not using cookies
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
