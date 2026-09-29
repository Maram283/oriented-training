import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { generateSwaggerSpec } from './swagger.registry';

export const setupSwagger = (app: Express) => {
  const swaggerSpec = generateSwaggerSpec();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:3000/api-docs');
};
