import { DocumentBuilder } from '@nestjs/swagger';

const openAPIConfig = new DocumentBuilder()
  .setTitle('API Excercise')
  .setDescription('Authorization & Authentication with NestJS and JWT')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Refresh token',
      description: 'Enter refresh token',
      in: 'header',
    },
    'refresh-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .build();

export default openAPIConfig;
