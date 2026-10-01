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
    200: { description: 'Login successful - returns token OR requires2FA flag with tempToken' },
    401: { description: 'Invalid credentials' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login/verify-2fa',
  tags: ['Auth'],
  summary: 'Verify 2FA code during login',
  security: [],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: z.object({
        tempToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1Ni...' }),
        code: z.string().length(6).openapi({ example: '123456' }),
      }) } },
    },
  },
  responses: {
    200: { description: '2FA verification successful - returns real token' },
    400: { description: 'Validation failed' },
    401: { description: 'Invalid 2FA code' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/2fa/generate',
  tags: ['Auth'],
  summary: 'Generate 2FA secret and QR Code for logged-in user',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'QR Code generated successfully' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/2fa/verify',
  tags: ['Auth'],
  summary: 'Verify 2FA setup and enable it for the user',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: z.object({
        code: z.string().length(6).openapi({ example: '123456' }),
      }) } },
    },
  },
  responses: {
    200: { description: '2FA enabled successfully' },
    400: { description: 'Invalid code' },
    401: { description: 'Unauthorized' },
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
