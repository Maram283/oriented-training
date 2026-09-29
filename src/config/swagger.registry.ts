import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// ─── Reusable Schemas ──────────────────────────────────────────────────────────

const AuthBodySchema = z.object({
  userName: z.string().min(1).openapi({ example: 'MaramSalmeyeh' }),
  password: z.string().min(6).openapi({ example: 'maram123123' }),
});

const TaskBodySchema = z.object({
  title: z.string().min(1).openapi({ example: 'Learn Node.js' }),
  description: z.string().optional().nullable().openapi({ example: 'Study Swagger and Prisma' }),
});

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// ─── Auth Routes ───────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  security: [],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: AuthBodySchema } },
    },
  },
  responses: {
    201: { description: 'User registered successfully' },
    400: { description: 'Validation failed' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Login user and get JWT token',
  security: [],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: AuthBodySchema } },
    },
  },
  responses: {
    200: { description: 'Login successful - returns token' },
    401: { description: 'Invalid credentials' },
  },
});

// ─── Task Routes ───────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/tasks',
  tags: ['Tasks'],
  summary: 'Create a new task',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: TaskBodySchema } },
    },
  },
  responses: {
    201: { description: 'Task created successfully' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/tasks/my-tasks',
  tags: ['Tasks'],
  summary: 'Get all tasks for the logged-in user',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'List of user tasks' },
    401: { description: 'Unauthorized' },
  },
});

// ─── User Routes ───────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/users/current',
  tags: ['Users'],
  summary: 'Get current logged-in user profile',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'Current user profile' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: { description: 'User profile' },
    404: { description: 'User not found' },
  },
});

// ─── Admin Routes ──────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/admin/users',
  tags: ['Admin'],
  summary: 'Get all users (Admin only)',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'List of all users' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden - Admins only' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/tasks',
  tags: ['Admin'],
  summary: 'Get all tasks (Admin only)',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'List of all tasks' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden - Admins only' },
  },
});

// ─── Generate Spec ─────────────────────────────────────────────────────────────

export const generateSwaggerSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Node.js TS Prisma API',
      version: '1.0.0',
      description: 'API documentation for the Node.js TypeScript Prisma project',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
  });
};
